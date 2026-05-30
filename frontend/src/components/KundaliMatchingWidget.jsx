import { useEffect } from 'react'

const widgetScriptId = 'widget-kundli-matching-17801323820-script'
const widgetContainerId = 'wb-widget-kundli-matching-17801323820'
const widgetSetting = '11740'
const widgetSrc = 'https://astroapi-6.divineapi.com/widget/kundli_matching.js?17801323820&widget_token=361bd4d17f555e36712551350db3ee94&widget_id=wb-widget-kundli-matching-17801323820&setting=11740'

function KundaliMatchingWidget() {
  useEffect(() => {
    document.getElementById(widgetScriptId)?.remove()

    const script = document.createElement('script')
    script.id = widgetScriptId
    script.className = 'wb_widget_kundli_matching'
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

export default KundaliMatchingWidget
