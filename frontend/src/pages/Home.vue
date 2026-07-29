<template>
  <div class="p-6 bg-[#f5f7fb] min-h-screen">

    <!-- HEADER -->
    <div class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

      <div>
        <h1 class="text-2xl font-semibold text-gray-800">
          Welcome, Admin 👋
        </h1>

        <p class="text-gray-500 text-sm">
          Here's what's happening in your HR department today.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2">

        <input type="date" v-model="fromDate" class="border rounded-lg px-3 py-2 text-sm" />

        <input type="date" v-model="toDate" class="border rounded-lg px-3 py-2 text-sm" />

        <button @click="loadDashboard" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
          Apply Filter
        </button>

        <button @click="goBack" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">
          ← Back
        </button>

      </div>

    </div>

    <!-- TOP CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 mb-6">

      <div v-for="card in cards" :key="card.title" @click="openRoute(card.route)"
        class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

        <div :class="card.bg" class="p-3 rounded-lg text-white">
          <component :is="card.icon" class="w-5 h-5" />
        </div>

        <div>

          <p class="text-xs text-gray-400">
            {{ card.title }}
          </p>

          <h2 class="text-lg font-semibold text-gray-800">
            {{ card.value }}
          </h2>

          <p v-if="card.change" :class="card.changeColor" class="text-xs">
            {{ card.change }}
          </p>

        </div>

      </div>

    </div>

    <!-- PAYROLL OVERVIEW -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

      <div @click="openRoute('/app/salary-slip')"
        class="bg-white p-5 rounded-2xl shadow-sm lg:col-span-2 cursor-pointer hover:shadow-lg transition">

        <div class="flex items-center justify-between mb-4">

          <h2 class="text-lg font-semibold text-gray-700">
            Payroll Overview
          </h2>

          <div class="flex gap-4 text-xs">

            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <span class="text-gray-500">
                Paid
              </span>
            </div>

            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <span class="text-gray-500">
                Pending
              </span>
            </div>

            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-500"></div>
              <span class="text-gray-500">
                Total
              </span>
            </div>

          </div>

        </div>

        <apexchart :key="chartKey" width="100%" type="line" height="360" :options="lineOptions" :series="lineSeries" />

      </div>

      <!-- DONUT -->
      <div @click="openRoute('/app/department')"
        class="bg-white p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition">

        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          Employees by Department
        </h2>

        <apexchart type="donut" height="320" :options="donutOptions" :series="donutSeries" />

      </div>

    </div>

    <!-- SECOND ROW -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <!-- ATTENDANCE -->
      <div @click="openRoute('/app/attendance')"
        class="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition">

        <h2 class="font-medium text-gray-700 mb-4">
          Employee Attendance
        </h2>

        <apexchart type="donut" height="260" :options="attendanceOptions" :series="attendanceSeries" />
      </div>

      <!-- RECENT EMPLOYEES -->
      <div @click="openRoute('/app/employee')"
        class="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition">

        <h2 class="font-medium text-gray-700 mb-4">
          Recently Joined Employees
        </h2>

        <div v-for="employee in employees" :key="employee.name" class="flex justify-between items-center mb-3">

          <div class="flex gap-3 items-center">

            <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircleIcon class="w-5 h-5 text-blue-500" />
            </div>

            <div>

              <p class="text-sm text-gray-700">
                {{ employee.employee_name }}
              </p>

              <p class="text-xs text-gray-400">
                {{ employee.date_of_joining }}
              </p>

            </div>

          </div>

          <span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
            Active
          </span>

        </div>

      </div>

      <!-- NOTIFICATIONS -->
      <div @click="openRoute('/app/notification-log')"
        class="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition">

        <h2 class="font-medium text-gray-700 mb-4">
          HR Notifications
        </h2>

        <div v-for="n in notifications" :key="n.text" class="flex gap-3 mb-3 items-start">

          <div :class="n.bg" class="w-9 h-9 rounded-lg flex items-center justify-center">
            <component :is="n.icon" class="w-5 h-5 text-white" />
          </div>

          <div>

            <p class="text-sm text-gray-700">
              {{ n.text }}
            </p>

            <p class="text-xs text-gray-400">
              {{ n.time }}
            </p>

          </div>

        </div>

      </div>

      <!-- QUICK LINKS -->
      <div class="bg-white p-4 rounded-xl shadow-sm">

        <h2 class="font-medium text-gray-700 mb-4">
          Quick Links
        </h2>

        <div class="grid grid-cols-3 gap-4">

          <div v-for="link in links" :key="link.name" @click="openRoute(link.route)"
            class="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition">

            <div :class="link.bg" class="p-3 rounded-lg text-white">
              <component :is="link.icon" class="w-5 h-5" />
            </div>

            <p class="text-xs text-gray-600">
              {{ link.name }}
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue"

import {
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  ExclamationCircleIcon,
  UserPlusIcon,
  UserCircleIcon,
  BellIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/vue/24/solid"

const fromDate = ref("")
const toDate = ref("")

const employees = ref([])
const refreshTimer = ref(null)
const chartKey = ref(0)

const getDateRange = () => {
  const today = new Date().toISOString().split("T")[0]

  return {
    from: fromDate.value || today,
    to: toDate.value || today
  }
}

const goBack = () => {
  window.history.back()
}

const openRoute = (route) => {
  window.location.href = route
}

const cards = ref([
  {
    title: "Total Employees",
    value: "0",
    icon: UserGroupIcon,
    bg: "bg-purple-500",
    route: "/app/employee"
  },
  {
    title: "Departments",
    value: "0",
    icon: BuildingOfficeIcon,
    bg: "bg-green-500",
    route: "/app/department"
  },
  {
    title: "Present Employees",
    value: "0",
    icon: CheckCircleIcon,
    bg: "bg-yellow-500",
    route: "/app/attendance"
  },
  {
    title: "Absent Employees",
    value: "0",
    icon: XCircleIcon,
    bg: "bg-red-500",
    route: "/app/attendance"
  },
  {
    title: "Employees on Leave",
    value: "0",
    icon: CalendarDaysIcon,
    bg: "bg-yellow-500",
    route: "/app/leave-application"
  },
  {
    title: "Payroll",
    value: "₹ 0",
    icon: CurrencyRupeeIcon,
    bg: "bg-blue-500",
    route: "/app/salary-slip"
  }

])
const getCount = async (doctype, filters = null) => {

  try {

    let url = `/api/method/frappe.client.get_count?doctype=${doctype}`

    if (filters) {
      url += `&filters=${encodeURIComponent(
        JSON.stringify(filters)
      )}`
    }

    const res = await fetch(url)
    const data = await res.json()

    return data.message || 0

  } catch (err) {

    console.error(err)
    return 0

  }

}
const fetchDashboardCounts = async () => {
  try {

    const { from, to } = getDateRange()

    const employeeFilters = [
      ["creation", ">=", `${from} 00:00:00`],
      ["creation", "<=", `${to} 23:59:59`]
    ]

    // Employee Count
    cards.value[0].value = await getCount("Employee", employeeFilters)

    // Department Count (total departments)
    cards.value[1].value = await getCount("Department")

    // Payroll
    const salaryFilters = encodeURIComponent(
      JSON.stringify([
        ["posting_date", ">=", from],
        ["posting_date", "<=", to]
      ])
    )

    const fields = encodeURIComponent(
      JSON.stringify([
        "gross_pay",
        "net_pay",
        "status"
      ])
    )

    const response = await fetch(
      `/api/resource/Salary Slip?fields=${fields}&filters=${salaryFilters}&limit_page_length=10000`
    )

    const data = await response.json()

    let payroll = 0

      ; (data.data || []).forEach((row) => {
        payroll += Number(row.gross_pay || 0)
      })

    // Payroll card (index 5)
    cards.value[5].value = `₹ ${payroll.toLocaleString("en-IN")}`

  } catch (err) {
    console.error("Dashboard Count Error:", err)
  }
}
const fetchRecentEmployees = async () => {
  try {

    const { from, to } = getDateRange()

    const fields = encodeURIComponent(
      JSON.stringify([
        "name",
        "employee_name",
        "designation",
        "date_of_joining",
        "creation"
      ])
    )

    const filters = encodeURIComponent(
      JSON.stringify([
        ["creation", ">=", `${from} 00:00:00`],
        ["creation", "<=", `${to} 23:59:59`]
      ])
    )

    const res = await fetch(
      `/api/resource/Employee?fields=${fields}&filters=${filters}&order_by=creation desc&limit_page_length=5`
    )

    const data = await res.json()

    employees.value = data.data || []

  } catch (err) {
    console.error("Recent Employees Error:", err)
    employees.value = []
  }
}
const lineSeries = ref([
  {
    name: "Paid Salary",
    data: Array(12).fill(0)
  },
  {
    name: "Pending Salary",
    data: Array(12).fill(0)
  },
  {
    name: "Total Payroll",
    data: Array(12).fill(0)
  }
])

const lineOptions = ref({

  chart: {
    id: "payroll-chart",
    type: "line",
    height: 350,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    animations: {
      enabled: true
    }
  },

  noData: {
    text: "Loading..."
  },

  stroke: {
    curve: "smooth",
    width: 4
  },

  dataLabels: {
    enabled: false
  },

  markers: {
    size: 5,
    hover: {
      size: 8
    }
  },

  colors: [
    "#22C55E",
    "#EF4444",
    "#3B82F6"
  ],

  legend: {
    show: true,
    position: "top"
  },

  xaxis: {

    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],

    title: {
      text: "Months"
    }

  },

  yaxis: {

    title: {
      text: "Salary Amount"
    },

    labels: {
      formatter(val) {
        return "₹ " + Number(val).toLocaleString("en-IN")
      }
    }

  },

  tooltip: {

    shared: true,

    y: {
      formatter(value) {
        return "₹ " + Number(value).toLocaleString("en-IN")
      }
    }

  },

  grid: {
    borderColor: "#E5E7EB",
    strokeDashArray: 4
  }

})

const fetchPayrollChart = async () => {

  try {

    const response = await fetch(

      `/api/resource/Salary Slip?fields=${encodeURIComponent(

        JSON.stringify([
          "posting_date",
          "gross_pay",
          "net_pay",
          "status"
        ])

      )}&limit_page_length=10000`

    )

    const data = await response.json()

    const months = [

      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"

    ]

    const paid = {}
    const pending = {}
    const total = {}

    months.forEach(month => {

      paid[month] = 0
      pending[month] = 0
      total[month] = 0

    })

    data.data?.forEach(row => {

      const month = new Date(row.posting_date)
        .toLocaleString("default", {
          month: "short"
        })

      const gross = Number(row.gross_pay || 0)
      const net = Number(row.net_pay || 0)

      total[month] += gross

      if (row.status === "Submitted") {

        paid[month] += gross

      } else {

        pending[month] += net

      }

    })

    lineSeries.value = [

      {
        name: "Paid Salary",
        data: months.map(m => paid[m])
      },

      {
        name: "Pending Salary",
        data: months.map(m => pending[m])
      },

      {
        name: "Total Payroll",
        data: months.map(m => total[m])
      }

    ]

    await nextTick()

    chartKey.value++

  }

  catch (err) {

    console.log(err)

  }

}
const donutSeries = ref([])

const donutOptions = ref({
  chart: {
    type: "donut"
  },

  labels: [],

  legend: {
    position: "bottom"
  },

  dataLabels: {
    enabled: true
  },

  tooltip: {
    y: {
      formatter: (val) => `${val} Employees`
    }
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Employees",
            formatter() {
              return donutSeries.value.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    }
  }
})

const fetchEmployeesByDepartment = async () => {
  try {

    const fields = encodeURIComponent(
      JSON.stringify(["department"])
    )

    const response = await fetch(
      `/api/resource/Employee?fields=${fields}&limit_page_length=10000`
    )

    const data = await response.json()

    const departmentMap = {}

      ; (data.data || []).forEach((emp) => {

        if (!emp.department) return

        departmentMap[emp.department] =
          (departmentMap[emp.department] || 0) + 1
      })

    donutOptions.value = {
      ...donutOptions.value,
      labels: Object.keys(departmentMap)
    }

    donutSeries.value = Object.values(departmentMap)

  } catch (err) {
    console.error(err)

    donutOptions.value = {
      ...donutOptions.value,
      labels: []
    }

    donutSeries.value = []
  }
}
const attendanceSeries = ref([])

const attendanceOptions = ref({

  chart: {
    type: "donut"
  },

  labels: [
    "Present",
    "Absent",
    "On Leave"
  ],

  colors: [
    "#22C55E",
    "#EF4449",
    "#F59E0B"
  ],

  legend: {
    position: "bottom",
    fontSize: "14px"
  },

  dataLabels: {
    enabled: true
  },

  stroke: {
    width: 2,
    colors: ["#fff"]
  },

  tooltip: {
    y: {
      formatter: (val) => `${val} Employees`
    }
  },

  plotOptions: {
    pie: {
      donut: {
        size: "70%",

        labels: {

          show: true,

          total: {

            show: true,

            label: "Total",

            formatter() {
              return attendanceSeries.value.reduce(
                (a, b) => a + b,
                0
              )
            }

          }

        }

      }

    }

  }

})
const fetchAttendanceOverview = async () => {

  try {

    const { from, to } = getDateRange()

    const fields = encodeURIComponent(
      JSON.stringify([
        "employee",
        "attendance_date",
        "status"
      ])
    )

    const filters = encodeURIComponent(
      JSON.stringify([
        ["attendance_date", ">=", from],
        ["attendance_date", "<=", to]
      ])
    )

    const response = await fetch(
      `/api/resource/Attendance?fields=${fields}&filters=${filters}&limit_page_length=10000`
    )

    const data = await response.json()

    const rows = data.data || []

    let present = 0
    let absent = 0
    let onLeave = 0

    rows.forEach((row) => {

      if (row.status === "Present") {
        present++
      }

      else if (row.status === "Absent") {
        absent++
      }

      else if (row.status === "On Leave") {
        onLeave++
      }

    })

    attendanceSeries.value = [
      present,
      absent,
      onLeave
    ]

    cards.value[2].value = present
    cards.value[3].value = absent
    cards.value[4].value = onLeave

  }

  catch (err) {

    console.error("Attendance Error:", err)

    attendanceSeries.value = [0, 0, 0]

    cards.value[2].value = "0"
    cards.value[3].value = "0"
    cards.value[4].value = "0"

  }

}
const notifications = ref([

  {

    text: "Salary processed successfully",

    time: "Today",

    icon: EnvelopeIcon,

    bg: "bg-pink-500"

  },

  {

    text: "New employee joined",

    time: "2 Hours Ago",

    icon: BellIcon,

    bg: "bg-green-500"

  },

  {

    text: "Leave request pending",

    time: "4 Hours Ago",

    icon: CalendarDaysIcon,

    bg: "bg-blue-500"

  }

])
const links = ref([

  {

    name: "Employee",

    icon: UserPlusIcon,

    bg: "bg-purple-500",

    route: "/app/employee/new-employee"

  },

  {

    name: "Attendance",

    icon: CalendarDaysIcon,

    bg: "bg-green-500",

    route: "/app/attendance"

  },

  {

    name: "Payroll",

    icon: CurrencyRupeeIcon,

    bg: "bg-blue-500",

    route: "/app/payroll-entry"

  },

  {

    name: "Department",

    icon: BuildingOfficeIcon,

    bg: "bg-yellow-500",

    route: "/app/department"

  },

  {

    name: "Designation",

    icon: BriefcaseIcon,

    bg: "bg-red-500",

    route: "/app/designation"

  },

  {

    name: "Salary",

    icon: CurrencyRupeeIcon,

    bg: "bg-indigo-500",

    route: "/app/salary-slip"

  }

])
const loadDashboard = async () => {
  console.log("From:", fromDate.value)
  console.log("To:", toDate.value)

  await Promise.all([
    fetchDashboardCounts(),
    fetchRecentEmployees(),
    fetchPayrollChart(),
    fetchEmployeesByDepartment(),
    fetchAttendanceOverview()
  ])
}
onMounted(async () => {

  const today = new Date().toISOString().split("T")[0]

  // Set today's date only if no date is already selected
  if (!fromDate.value) {
    fromDate.value = today
  }

  if (!toDate.value) {
    toDate.value = today
  }

  await loadDashboard()

  refreshTimer.value = setInterval(() => {
    loadDashboard()
  }, 10000)

})

onUnmounted(() => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
})
</script>