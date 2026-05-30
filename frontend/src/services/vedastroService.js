import axios from 'axios'
import api from './api'

const vedastroApi = axios.create({
  baseURL: import.meta.env.VITE_VEDASTRO_GENERATE_API_URL || '',
  timeout: 20000,
})

const VEDASTRO_BASE_URL = import.meta.env.VITE_VEDASTRO_API_URL || 'https://api.vedastro.org'

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

const buildCachedResponse = (birthDetails) => {
  const seed = `${birthDetails.dateOfBirth || ''}${birthDetails.timeOfBirth || ''}${birthDetails.placeOfBirth || ''}`.length
  const sign = zodiacSigns[seed % zodiacSigns.length]
  const createdAt = new Date().toISOString()

  return {
    source: 'local-cache',
    generatedAt: createdAt,
    horoscopeData: {
      sign,
      summary: `${sign} influence is active. Review career, family, finance, and health timing with the client before final advice.`,
      career: 'A practical window for structured decisions and pending conversations.',
      finance: 'Avoid impulsive commitments; compare options and document promises.',
      health: 'Stable routines, rest, and consistency are favored.',
      relationships: 'Clear communication prevents avoidable misunderstanding.',
    },
    kundliData: {
      lagna: sign,
      moonSign: zodiacSigns[(seed + 3) % zodiacSigns.length],
      nakshatra: ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Uttara Phalguni', 'Anuradha'][seed % 6],
      chartSvg: null,
      houses: [
        { house: 1, theme: 'Self', note: 'Identity and confidence need grounding.' },
        { house: 4, theme: 'Home', note: 'Family comfort supports decisions.' },
        { house: 7, theme: 'Partnership', note: 'Agreements should stay explicit.' },
        { house: 10, theme: 'Career', note: 'Professional discipline brings progress.' },
      ],
    },
    aiInsights: [
      'Ask what changed since the last visit before generating new predictions.',
      'Mark sensitive advice as guidance and not a guarantee.',
      'Use the notes section to preserve context for the next session.',
    ],
    matchHistory: [],
    goodTimeFinder: [
      { label: 'Planning', window: 'Morning', note: 'Good for paperwork and decision review.' },
      { label: 'Spiritual remedy', window: 'Evening', note: 'Good for mantra, reflection, and follow-up notes.' },
    ],
  }
}

const toVedAstroDate = (value) => {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

const buildStdTime = ({ time, date }) => `${time} ${toVedAstroDate(date)} +05:30`

const isSvgMarkup = (value) => typeof value === 'string' && /<svg[\s>]/i.test(value)

const extractMatchReport = (rawReport, matchPayload) => {
  const report = rawReport?.Payload?.MatchReport || rawReport?.MatchReport || rawReport?.Payload || {}
  const predictionList = report.PredictionList || report.Predictions || []

  return {
    id: crypto.randomUUID(),
    type: 'match-report',
    score: report.KutaScore ?? report.Score ?? null,
    summary: report.Summary?.ScoreSummary || report.Summary || 'Match report generated.',
    partnerDetails: { ...matchPayload },
    generatedAt: new Date().toISOString(),
    rawReport,
    predictions: Array.isArray(predictionList) ? predictionList.map((item) => ({
      name: item.Name || item.name || 'Compatibility point',
      nature: item.Nature || item.nature || 'Neutral',
      info: item.Info || item.info || item.Description || item.description || '',
    })) : [],
  }
}

export const vedastroService = {
  generateData: async (birthDetails) => {
    if (!import.meta.env.VITE_VEDASTRO_GENERATE_API_URL) {
      return buildCachedResponse(birthDetails)
    }

    const response = await vedastroApi.post('/generate', birthDetails)
    return {
      generatedAt: new Date().toISOString(),
      source: 'vedastro',
      ...response.data,
    }
  },
  fetchKundliChartSvg: async (birthData) => {
    const payload = {
      time: birthData.time,
      date: birthData.date,
      location: birthData.location,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezoneOffset: birthData.timezoneOffset,
      chartType: birthData.chartType || 'RasiD1',
      ayanamsa: birthData.ayanamsa || 'RAMAN',
    }

    const response = await api.post('/customers/kundli-chart', payload, {
      headers: {
        Accept: 'image/svg+xml',
        'Content-Type': 'application/json',
      },
      responseType: 'text',
      timeout: 20000,
    }).catch(async (error) => {
      if (error.response && error.response.status !== 404) throw error

      return axios.post(`${VEDASTRO_BASE_URL}/api/Calculate/NorthIndianChart`, {
        Time: {
          StdTime: buildStdTime({
            time: birthData.time,
            date: birthData.date,
          }),
          Location: {
            Name: birthData.location,
            ...(Number.isFinite(Number(birthData.latitude)) ? { Latitude: Number(birthData.latitude) } : {}),
            ...(Number.isFinite(Number(birthData.longitude)) ? { Longitude: Number(birthData.longitude) } : {}),
          },
        },
        ChartType: birthData.chartType || 'RasiD1',
        Ayanamsa: birthData.ayanamsa || 'RAMAN',
      }, {
        headers: {
          Accept: 'image/svg+xml',
          'Content-Type': 'application/json',
        },
        responseType: 'text',
        timeout: 20000,
      })
    })

    if (!isSvgMarkup(response.data)) throw new Error('Kundli chart API did not return SVG markup.')
    return response.data
  },
  fetchMatchReport: async (matchPayload) => {
    const response = await axios.post(`${VEDASTRO_BASE_URL}/api/Calculate/MatchReport`, {
      MaleBirthTime: {
        StdTime: buildStdTime({
          time: matchPayload.maleTime,
          date: matchPayload.maleDate,
        }),
        Location: {
          Name: matchPayload.maleLocation,
        },
      },
      FemaleBirthTime: {
        StdTime: buildStdTime({
          time: matchPayload.femaleTime,
          date: matchPayload.femaleDate,
        }),
        Location: {
          Name: matchPayload.femaleLocation,
        },
      },
      Ayanamsa: 'RAMAN',
    }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    })

    return extractMatchReport(response.data, matchPayload)
  },
}
