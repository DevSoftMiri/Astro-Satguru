import { useEffect } from 'react'

const widgetScriptId = 'widget-love-calculator-17801343483-script'
const widgetContainerId = 'wb-widget-love-calculator-17801343483'
const widgetSetting = '11743'
const widgetSrc = 'https://astroapi-6.divineapi.com/widget/love_calculator.js?17801343483&widget_token=361bd4d17f555e36712551350db3ee94&widget_id=wb-widget-love-calculator-17801343483&setting=11743'

function LoveCalculatorWidget() {
  useEffect(() => {
    document.getElementById(widgetScriptId)?.remove()

    const script = document.createElement('script')
    script.id = widgetScriptId
    script.className = 'wb_widget_loveCalculator'
    script.src = widgetSrc
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.getElementById(widgetScriptId)?.remove()
    }
  }, [])

  return (
    <div className="min-h-[600px] w-full rounded-md border border-slate-200 bg-white p-5">
      <div
        id={widgetContainerId}
        className="open_setting"
        data-wb_setting={widgetSetting}
      />
    </div>
  )
}

export default LoveCalculatorWidget
