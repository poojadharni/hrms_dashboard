import './index.css'

import { createApp } from 'vue'

import router from './router'

import App from './App.vue'

import {
  Button,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

import VueApexCharts from 'vue3-apexcharts'


let vueApp = null
let mountedMainSection = null
let previousMainSectionPadding = ''
let mountRetryTimer = null
let mountAttempts = 0


function mountHRMSDashboard() {

  if (!window.frappe) {
    return false
  }


  const route = frappe.get_route()


  if (
    !route ||
    route[0] !== 'hrms_dashboard'
  ) {
    return false
  }


  /*
   * Prevent duplicate mounting
   */
  if (
    document.getElementById(
      'hrms-dashboard-vue-host'
    )
  ) {
    return true
  }


  /*
   * Frappe main content
   */
  const currentPage =
    frappe.container?.page

  const mainSection =
    currentPage?.querySelector(
      '.layout-main-section'
    ) ||
    [...document.querySelectorAll(
      '.layout-main-section'
    )].find(
      section => section.getClientRects().length > 0
    )


  if (!mainSection) {
    return false
  }

  mountedMainSection = mainSection
  previousMainSectionPadding = mainSection.style.padding


  /*
   * Remove padding only from
   * HRMS Dashboard content.
   */
  mainSection.style.padding = '0'


  /*
   * Create host
   */
  const host =
    document.createElement('div')

  host.id =
    'hrms-dashboard-vue-host'

  host.style.width =
    '100%'

  host.style.minHeight =
    'calc(100vh - 100px)'

  host.style.boxSizing =
    'border-box'


  mainSection.replaceChildren(host)


  /*
   * Create Shadow DOM
   *
   * HRMS CSS will stay inside this
   * Shadow DOM.
   */
  const shadow =
    host.attachShadow({
      mode: 'open'
    })


  /*
   * Load HRMS CSS ONLY inside
   * Shadow DOM.
   */
  const css =
    document.createElement('link')

  css.rel =
    'stylesheet'

  css.href =
    '/assets/hrms_dashboard/frontend/index.css'

  shadow.appendChild(css)


  /*
   * Vue container
   */
  const container =
    document.createElement('div')

  container.id =
    'hrms-dashboard-vue'

  container.style.width =
    '100%'

  container.style.minHeight =
    '100%'

  container.style.boxSizing =
    'border-box'


  shadow.appendChild(container)


  /*
   * Create Vue app
   */
  vueApp =
    createApp(App)


  /*
   * Frappe UI
   */
  setConfig(
    'resourceFetcher',
    frappeRequest
  )


  vueApp.use(router)

  vueApp.use(
    resourcesPlugin
  )

  vueApp.use(
    VueApexCharts
  )


  /*
   * Components
   */
  vueApp.component(
    'Button',
    Button
  )

  vueApp.component(
    'apexchart',
    VueApexCharts
  )


  /*
   * Mount Vue
   */
  vueApp.mount(
    container
  )


  console.log(
    'HRMS Dashboard mounted successfully'
  )

  return true
}


/*
 * Remove dashboard
 */
function unmountHRMSDashboard() {

  if (mountRetryTimer) {
    clearTimeout(mountRetryTimer)
    mountRetryTimer = null
  }

  mountAttempts = 0

  if (vueApp) {

    try {
      vueApp.unmount()
    } catch (error) {
      console.error(
        'HRMS Vue unmount error:',
        error
      )
    }

    vueApp = null
  }


  const host =
    document.getElementById(
      'hrms-dashboard-vue-host'
    )


  if (host) {
    host.remove()
  }

  if (mountedMainSection) {
    mountedMainSection.style.padding = previousMainSectionPadding
    mountedMainSection = null
    previousMainSectionPadding = ''
  }
}


function mountDashboardWhenReady() {

  const route =
    window.frappe?.get_route?.()


  if (!route || route[0] !== 'hrms_dashboard') {
    unmountHRMSDashboard()
    return
  }


  if (mountHRMSDashboard()) {
    mountAttempts = 0
    return
  }


  mountAttempts += 1

  if (mountAttempts >= 30) {
    console.error(
      'HRMS Dashboard could not mount because the Frappe main section was not available'
    )
    mountAttempts = 0
    return
  }


  mountRetryTimer = setTimeout(() => {
    mountRetryTimer = null
    mountDashboardWhenReady()
  }, 100)
}


function checkRouteAfterRender() {

  if (typeof frappe.after_ajax === 'function') {
    frappe.after_ajax(() => {
      setTimeout(checkRoute, 0)
    })
    return
  }


  setTimeout(checkRoute, 300)
}


/*
 * Check current route
 */
function checkRoute() {

  if (
    !window.frappe ||
    typeof frappe.get_route !== 'function'
  ) {
    return
  }


  const route =
    frappe.get_route()


  if (
    route &&
    route[0] === 'hrms_dashboard'
  ) {

    if (mountRetryTimer) {
      clearTimeout(mountRetryTimer)
    }

    mountAttempts = 0
    mountRetryTimer = setTimeout(() => {
      mountRetryTimer = null
      mountDashboardWhenReady()
    }, 300)

  } else {

    unmountHRMSDashboard()

  }
}


/*
 * Initialize
 */
function initialize() {

  if (
    !window.frappe ||
    !frappe.router ||
    typeof frappe.router.on !== 'function' ||
    typeof frappe.get_route !== 'function'
  ) {

    setTimeout(
      initialize,
      200
    )

    return
  }


  /*
   * Initial load
   */
  setTimeout(() => {
    checkRouteAfterRender()
  }, 500)


  /*
   * Frappe navigation
   */
  frappe.router.on(
    'change',
    () => {
      checkRouteAfterRender()
    }
  )
}


initialize()