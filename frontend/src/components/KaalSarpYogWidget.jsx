import { useEffect } from 'react'

const widgetScriptId = 'widget-kaal-sarp-yog-17801424800-script'
const widgetContainerId = 'wb-widget-kaal-sarp-yog-17801424800'
const widgetSetting = '11744'
const widgetSrc = 'https://astroapi-6.divineapi.com/widget/kaal_sarp_yog.js?17801424800&widget_token=361bd4d17f555e36712551350db3ee94&widget_id=wb-widget-kaal-sarp-yog-17801424800&setting=11744'

function KaalSarpYogWidget() {
  useEffect(() => {
    document.getElementById(widgetScriptId)?.remove()

    const script = document.createElement('script')
    script.id = widgetScriptId
    script.className = 'wb_widget_kaal_sarp_yog'
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

export default KaalSarpYogWidget
