import { useEffect } from 'react'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'

function LocationSearchInput({ value, onChange, onLocationSelect }) {
  const {
    ready,
    value: searchValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    defaultValue: value || '',
  })

  useEffect(() => {
    setValue(value || '', false)
  }, [setValue, value])

  const handleInput = (event) => {
    const nextValue = event.target.value
    setValue(nextValue)
    onChange?.(nextValue)
  }

  const handleSelect = (suggestion) => async () => {
    const locationName = suggestion.description
    setValue(locationName, false)
    clearSuggestions()
    onChange?.(locationName)

    try {
      const results = await getGeocode({ address: locationName })
      const { lat, lng } = getLatLng(results[0])
      onLocationSelect?.({
        name: locationName,
        latitude: lat,
        longitude: lng,
      })
    } catch {
      onLocationSelect?.({
        name: locationName,
        latitude: '',
        longitude: '',
      })
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={searchValue}
        onChange={handleInput}
        disabled={!ready}
        className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        placeholder={ready ? 'e.g. Ambala, Haryana, India' : 'Google Places is loading...'}
      />
      {status === 'OK' && (
        <ul className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {data.map((suggestion) => {
            const {
              place_id: placeId,
              structured_formatting: { main_text: mainText, secondary_text: secondaryText },
            } = suggestion

            return (
              <li key={placeId}>
                <button
                  type="button"
                  onClick={handleSelect(suggestion)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span className="font-semibold text-slate-900">{mainText}</span>
                  {secondaryText ? <span className="ml-1 text-slate-500">{secondaryText}</span> : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default LocationSearchInput
