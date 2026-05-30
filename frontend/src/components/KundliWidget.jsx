import { useEffect } from 'react'

const widgetScriptId = 'widget-kundli-17801311096-script'
const widgetContainerId = 'wb-widget-kundli-17801311096'
const widgetSetting = '11738'
const widgetSrc = 'https://astroapi-6.divineapi.com/widget/kundli.js?17801311096&widget_token=361bd4d17f555e36712551350db3ee94&widget_id=wb-widget-kundli-17801311096&setting=11738'

function KundliWidget() {
  useEffect(() => {
    document.getElementById(widgetScriptId)?.remove()

    const script = document.createElement('script')
    script.id = widgetScriptId
    script.className = 'wb_widget_kundli'
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

export default KundliWidget
