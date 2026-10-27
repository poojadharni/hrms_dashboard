<template>
  <main class="min-h-screen bg-[#f8f7fc] px-3 py-3 text-[#25213a] sm:px-5 lg:px-8">

    <!-- TOP NAVIGATION -->
    <header class="mb-4 flex items-center justify-between gap-3">
      <a href="/app" class="flex items-center gap-2 no-underline">
        <span
          class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-[#453D89] to-[#C8499A] text-xl font-black text-white shadow">✦</span>
        <span>
          <strong class="block text-base font-black tracking-widest">PEOPLE<span
              class="text-[#C8499A]">OS</span></strong>
          <small class="text-[9px] font-bold tracking-widest text-gray-600">HUMAN RESOURCES</small>
        </span>
      </a>

      <div class="flex items-center gap-2">
        <!-- NOTIFICATIONS -->
        <div class="relative">
          <button type="button"
            class="relative grid h-10 w-10 place-items-center rounded-xl border border-[#eeeaf5] bg-white text-xl text-[#453D89] shadow-sm"
            title="Notifications" aria-label="Notifications" @click="toggleNotifications">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 21h4" />
            </svg>
            <span v-if="unreadCount > 0"
              class="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#C8499A] px-1 text-[9px] font-black text-white ring-2 ring-white">
              {{ unreadCount > 99 ? "99+" : unreadCount }}
            </span>
          </button>

          <div v-if="notificationsOpen"
            class="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#eeeaf5] bg-white shadow-xl">

            <!-- HEADER WITH CLOSE BUTTON -->
            <div class="flex items-start justify-between gap-3 border-b border-purple-50 p-4">
              <div>
                <h3 class="text-sm font-black">Notifications</h3>
                <p class="mt-1 text-[10px] text-gray-600">{{ unreadCount }} unread</p>
              </div>

              <div class="flex items-center gap-3">
                <button class="text-[10px] font-bold text-[#C8499A] disabled:opacity-40" :disabled="!unreadCount"
                  @click="markAllNotificationsRead">
                  Mark all read
                </button>
                <button type="button"
                  class="grid h-7 w-7 place-items-center rounded-lg bg-gray-100 text-lg font-bold text-gray-600 hover:bg-red-50 hover:text-red-600"
                  aria-label="Close notifications" title="Close notifications" @click="notificationsOpen = false">
                  ×
                </button>
              </div>
            </div>

            <div class="max-h-80 overflow-y-auto">
              <button v-for="notification in notifications" :key="notification.name"
                class="flex w-full gap-3 border-b border-purple-50 p-3 text-left hover:bg-purple-50/60"
                :class="{ 'bg-purple-50/40': !isRead(notification) }" @click="openNotification(notification)">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-purple-50 text-[#453D89]">
                  {{ isRead(notification) ? "✓" : "●" }}
                </span>
                <span class="min-w-0 flex-1">
                  <strong class="block text-xs font-bold text-gray-800">
                    {{ notification.subject || "Notification" }}
                  </strong>
                  <span class="mt-1 block text-xs leading-5 text-gray-500">
                    {{ notificationMessage(notification) }}
                  </span>
                  <span class="mt-1 block text-[9px] text-gray-600">
                    {{ formatDateTime(notification.creation) }}
                  </span>
                </span>
                <span v-if="!isRead(notification)" class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C8499A]"></span>
              </button>

              <div v-if="!notifications.length && !notificationsLoading" class="p-6 text-center">
                <span class="text-2xl text-[#453D89]">✓</span>
                <p class="mt-2 text-xs font-bold text-gray-600">You're all caught up</p>
                <p class="mt-1 text-[10px] text-gray-600">New notifications will appear here.</p>
              </div>

              <div v-if="notificationsLoading" class="p-5 text-center text-xs text-gray-600">
                Loading notifications...
              </div>
            </div>

            <div class="border-t border-purple-50 p-3">
              <button
                class="w-full rounded-lg bg-gradient-to-r from-[#453D89] to-[#C8499A] px-3 py-2.5 text-xs font-bold text-white"
                @click="loadNotifications">
                Refresh notifications
              </button>
            </div>
          </div>
        </div>

        <!-- PROFILE -->
        <button type="button"
          class="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-r from-[#453D89] to-[#C8499A] text-sm font-bold text-white"
          title="Open profile" @click="openRoute('/app/user')">
          <img v-if="userImage" :src="userImage" :alt="displayName" class="h-full w-full object-cover"
            @error="userImage = ''" />
          <span v-else>{{ initials }}</span>
        </button>
      </div>
    </header>

    <!-- HERO -->
    <section
      class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#453D89] to-[#C8499A] p-5 text-white shadow-md sm:p-6">
      <div class="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10"></div>

      <div class="relative grid items-center gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <span
            class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold tracking-widest">
            <span class="h-2 w-2 rounded-full bg-emerald-300"></span>{{ roleLabel }}
          </span>

          <h1 class="mt-3 text-2xl font-black leading-tight sm:text-3xl">
            {{ heroTitle }} <span class="text-[#FFD8EF]">{{ heroSubtitle }}</span>
          </h1>

          <p class="mt-2 max-w-xl text-xs leading-5 text-white/80 sm:text-sm">
            Good {{ greeting }}, {{ displayName }}. {{ heroDescription }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button class="rounded-lg bg-white px-4 py-2.5 text-xs font-extrabold text-[#453D89]"
              @click="openRoute(isEmployee ? '/app/attendance' : '/app/employee')">
              {{ isEmployee ? "My Attendance" : "Employee Directory" }} ↗
            </button>
            <button class="rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white"
              @click="openRoute('/app/leave-application')">
              {{ isEmployee ? "Request Leave" : "Leave Applications" }} ↗
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3 rounded-xl border border-white/30 bg-white/95 p-4 text-[#25213a] shadow">
          <div
            class="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#453D89] to-[#C8499A] text-xl font-black text-white">
            <img v-if="userImage" :src="userImage" :alt="displayName" class="h-full w-full object-cover"
              @error="userImage = ''" />
            <span v-else>{{ initials }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[9px] font-bold uppercase tracking-widest text-[#C8499A]">Welcome back</p>
            <h2 class="mt-1 truncate text-base font-black">{{ displayName }}</h2>
            <p class="mt-1 truncate text-xs text-gray-500">{{ employee.designation || roleDisplay }}</p>
            <p class="mt-1 truncate text-[10px] text-gray-600">{{ employee.name || loggedUser }}</p>
          </div>
          <button class="shrink-0 text-xs font-bold text-[#C8499A]" @click="openRoute('/app/user')">Profile ↗</button>
        </div>
      </div>

      <div
        class="relative mt-4 flex flex-wrap justify-between gap-2 border-t border-white/20 pt-3 text-[10px] text-white/75">
        <span>{{ todayLabel }}</span>
        <span>{{ roleDisplay }}</span>
      </div>
    </section>

    <!-- LOADING -->
    <div v-if="loading"
      class="mt-4 flex items-center gap-3 rounded-xl border border-purple-100 bg-white p-3 text-sm font-semibold text-[#453D89]">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-purple-200 border-t-[#453D89]"></span>
      Loading dashboard...
    </div>

    <!-- ERROR -->
    <div v-if="errorMessage"
      class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      role="alert">
      <span>{{ errorMessage }}</span>
      <button class="rounded-lg bg-gradient-to-r from-[#453D89] to-[#C8499A] px-3 py-2 text-xs font-bold text-white"
        @click="loadDashboard">Retry</button>
    </div>

    <!-- GLOBAL DATE RANGE FILTER -->

    <section class="mt-3 rounded-xl border border-[#eeeaf5] bg-white px-4 py-3 shadow-sm">
      <div class="flex flex-wrap items-center gap-3">

        <!-- Title -->
        <div class="mr-auto min-w-fit">
          <h2 class="text-sm font-black text-[#25213a]">
            Dashboard Date Filter
          </h2>
          <p class="text-[10px] text-gray-600">
            {{ filterApplied ? "Custom date range" : "Default: Today" }}
          </p>
        </div>

        <!-- Start Date -->
        <div class="flex items-center gap-2">
          <label for="dashboard-start-date" class="whitespace-nowrap text-xs font-bold text-gray-600">
            From
          </label>
          <input id="dashboard-start-date" v-model="startDate" type="date"
            class="h-9 w-[145px] rounded-lg border border-purple-100 bg-[#faf9fd] px-2 text-xs font-semibold text-[#453D89] outline-none focus:border-[#C8499A]" />
        </div>

        <!-- End Date -->
        <div class="flex items-center gap-2">
          <label for="dashboard-end-date" class="whitespace-nowrap text-xs font-bold text-gray-600">
            To
          </label>
          <input id="dashboard-end-date" v-model="endDate" type="date"
            class="h-9 w-[145px] rounded-lg border border-purple-100 bg-[#faf9fd] px-2 text-xs font-semibold text-[#453D89] outline-none focus:border-[#C8499A]" />
        </div>

        <!-- Apply -->
        <button
          class="h-9 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#453D89] to-[#C8499A] px-4 text-xs font-bold text-white disabled:opacity-50"
          :disabled="dateLoading || loading" @click="applyDateFilter">
          {{ dateLoading ? "Applying..." : "Apply Filter" }}
        </button>

        <!-- Reset -->
        <button
          class="h-9 whitespace-nowrap rounded-lg border border-purple-100 px-3 text-xs font-bold text-[#453D89] hover:bg-purple-50 disabled:opacity-50"
          :disabled="dateLoading || loading" @click="resetDate">
          Reset
        </button>

      </div>

      <!-- Compact error message -->
      <p v-if="filterError" class="mt-2 text-xs font-semibold text-red-600">
        {{ filterError }}
      </p>

      <p class="mt-2 text-[10px] text-gray-600">
        Showing records from
        <strong>{{ formatDate(startDate) }}</strong> to
        <strong>{{ formatDate(endDate) }}</strong>.
      </p>
    </section>


    <!-- SHARED CHECK IN / OUT AND SHIFT -->
    <section v-if="hasEmployeeRecord" class="mt-4 grid grid-cols-1 items-stretch gap-3 lg:grid-cols-2">
      <article
        class="relative flex min-w-0 flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#453D89] to-[#C8499A] p-5 text-white shadow-md">
        <div class="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10"></div>

        <transition name="attendance-message">
          <div v-if="attendanceMessage" class="relative mb-3 rounded-lg border p-3 text-xs font-semibold"
            :class="attendanceMessageType === 'success' ? 'border-emerald-200/40 bg-emerald-400/20 text-white' : 'border-red-200/40 bg-red-400/20 text-white'"
            role="status" aria-live="polite">
            {{ attendanceMessageType === "success" ? "✓" : "!" }} {{ attendanceMessage }}
          </div>
        </transition>

        <div class="relative">
          <p class="text-xs font-semibold text-white/75">{{ isCheckedIn ? "Checked in" : "Attendance" }}</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight">
            {{ lastCheckin ? formatTime(lastCheckin.time) : "--:--" }}
          </h2>
          <p class="mt-1 text-xs text-white/80">
            {{ isCheckedIn ? "Your attendance session is active." : "Record attendance using GPS." }}
          </p>
          <p class="mt-1 text-[10px] text-white/70">Filter: {{ formatDate(startDate) }} – {{ formatDate(endDate) }}</p>
        </div>

        <div class="relative mt-5">
          <button type="button"
            class="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-[#453D89] shadow disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="checkinLoading || locationLoading || loading || !employee.name || !rangeIncludesToday"
            @click="recordCheckin">
            <span v-if="checkinLoading || locationLoading"
              class="h-4 w-4 animate-spin rounded-full border-2 border-purple-200 border-t-[#453D89]"></span>
            {{ locationLoading ? "Getting GPS location..." : checkinLoading ? "Saving attendance..." : isCheckedIn ?
              "Check Out" : "Check In" }}
            <span v-if="!locationLoading && !checkinLoading">↗</span>
          </button>
          <p class="mt-2 text-center text-[10px] text-white/75">
            ⌖ GPS is required. Actual current time is recorded.
          </p>
          <p v-if="!rangeIncludesToday" class="mt-1 text-center text-[10px] text-white/80">
            Include today in the date range to record attendance.
          </p>
        </div>
      </article>

      <article class="flex min-w-0 flex-col rounded-2xl border border-[#eeeaf5] bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span
              class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-50 text-lg text-[#453D89]">◷</span>
            <div>
              <h3 class="text-sm font-extrabold">My Shift</h3>
              <p class="mt-1 text-[10px] text-gray-600">Assignment overlapping the selected date range</p>
            </div>
          </div>
          <button class="shrink-0 text-xs font-bold text-[#C8499A]" @click="openRoute('/app/shift-assignment')">View
            ↗</button>
        </div>

        <div v-if="currentShift" class="mt-4 flex flex-1 flex-col justify-center rounded-xl bg-[#faf8fd] p-4">
          <h4 class="break-words text-xl font-black text-[#453D89]">{{ currentShift.shift_type || "Assigned Shift" }}
          </h4>
          <p class="mt-2 text-sm font-bold text-gray-700">
            {{ formatTime(currentShift.start_time) }} – {{ formatTime(currentShift.end_time) }}
          </p>
          <p class="mt-2 text-[10px] text-gray-600">
            {{ currentShift.start_date || "—" }} to {{ currentShift.end_date || "—" }}
          </p>
        </div>
        <div v-else class="mt-4 flex flex-1 items-center rounded-xl bg-[#faf8fd] p-4 text-xs text-gray-600">
          No shift assignment found for the selected range.
        </div>

        <button class="mt-3 w-full rounded-lg border border-purple-100 px-3 py-2.5 text-xs font-bold text-[#453D89]"
          @click="openRoute('/app/shift-assignment')">View Shift Assignments ↗</button>
      </article>

    </section>

    <!-- EMPLOYEE DASHBOARD -->
    <template v-if="isEmployee">
      <section class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

        <!-- ATTENDANCE -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <CardHeading icon="◷" title="Attendance Summary" link-label="View ↗" @open="openRoute('/app/attendance')" />
          <p class="mt-3 text-[10px] text-gray-600">{{ formatDate(startDate) }} – {{ formatDate(endDate) }}</p>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <div class="rounded-lg bg-emerald-50 p-3 text-center">
              <strong class="block text-xl font-black text-emerald-700">{{ attendanceSummary.present }}</strong>
              <span class="text-[10px] font-bold text-emerald-700">Present</span>
            </div>
            <div class="rounded-lg bg-red-50 p-3 text-center">
              <strong class="block text-xl font-black text-red-600">{{ attendanceSummary.absent }}</strong>
              <span class="text-[10px] font-bold text-red-600">Absent</span>
            </div>
            <div class="rounded-lg bg-purple-50 p-3 text-center">
              <strong class="block text-xl font-black text-[#453D89]">{{ attendanceSummary.half_day }}</strong>
              <span class="text-[10px] font-bold text-[#453D89]">Half day</span>
            </div>
          </div>
          <p class="mt-3 text-[10px] text-gray-600">{{ attendanceSummary.total }} attendance record(s)</p>
        </article>

        <!-- CHECK-IN HISTORY -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <CardHeading icon="⌚" title="Check-in History" link-label="View ↗"
            @open="openRoute('/app/employee-checkin')" />
          <div v-if="dateCheckins.length" class="mt-3 divide-y divide-purple-50">
            <div v-for="checkin in dateCheckins.slice(0, 5)" :key="checkin.name"
              class="flex items-center justify-between gap-2 py-2">
              <span class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full"
                  :class="checkin.log_type === 'IN' ? 'bg-emerald-500' : 'bg-[#C8499A]'"></span>
                <strong class="text-xs">{{ checkin.log_type === "IN" ? "Check In" : "Check Out" }}</strong>
              </span>
              <span class="text-xs font-bold text-[#453D89]">{{ formatDateTime(checkin.time) }}</span>
            </div>
          </div>
          <p v-else class="mt-3 text-xs text-gray-600">No check-in records in this date range.</p>
          <p v-if="dateCheckins.length > 5" class="mt-2 text-[10px] text-gray-600">Showing the first 5 records.</p>
        </article>

        <!-- TASKS -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <CardHeading icon="☑" title="Assigned Tasks" link-label="View ↗" @open="openRoute('/app/todo')" />
          <div v-if="employeeTasks.length" class="mt-3 divide-y divide-purple-50">
            <div v-for="task in employeeTasks.slice(0, 4)" :key="task.name" class="flex items-center gap-2 py-2">
              <span class="h-2 w-2 shrink-0 rounded-full bg-[#C8499A]"></span>
              <span class="min-w-0 flex-1 truncate text-xs text-gray-600">{{ task.description || task.name }}</span>
              <span class="text-[10px] text-gray-600">{{ task.status || "Open" }}</span>
            </div>
          </div>
          <p v-else class="mt-3 text-xs text-gray-600">No tasks found.</p>
        </article>

        <!-- LEAVE APPLICATIONS AND ALLOCATIONS -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <CardHeading icon="▤" title="Leave Overview" link-label="View ↗"
            @open="openRoute('/app/leave-application')" />
          <p class="mt-3 text-[10px] font-bold text-gray-600">Leave applications in selected range</p>
          <div v-if="leaveApplications.length" class="mt-2 divide-y divide-purple-50">
            <div v-for="leave in leaveApplications.slice(0, 4)" :key="leave.name" class="py-2">
              <div class="flex items-center justify-between gap-2">
                <strong class="text-xs text-gray-700">{{ leave.leave_type || "Leave" }}</strong>
                <span class="rounded-full bg-purple-50 px-2 py-1 text-[9px] font-bold text-[#453D89]">{{ leave.status ||
                  "Pending" }}</span>
              </div>
              <p class="mt-1 text-[10px] text-gray-600">{{ leave.from_date }} – {{ leave.to_date }}</p>
            </div>
          </div>
          <p v-else class="mt-2 text-xs text-gray-600">No leave applications in this range.</p>

          <div class="mt-3 border-t border-purple-50 pt-3">
            <p class="text-[10px] font-bold text-gray-600">Active leave allocations</p>
            <div v-if="leaveBalances.length" class="mt-2 grid grid-cols-2 gap-2">
              <div v-for="leave in leaveBalances.slice(0, 4)" :key="leave.name" class="rounded-lg bg-[#faf8fd] p-3">
                <strong class="block text-lg font-black text-[#453D89]">{{ Number(leave.allocated ||
                  0).toLocaleString("en-IN") }}</strong>
                <span class="mt-1 block text-xs text-gray-600">{{ leave.leave_type }}</span>
              </div>
            </div>
            <p v-else class="mt-2 text-xs text-gray-600">No allocation overlaps this range.</p>
          </div>
        </article>

        <!-- SALARY SLIPS -->

        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <CardHeading icon="₹" title="Salary Slips" link-label="View ↗" @open="openRoute('/app/salary-slip')" />

          <div v-if="salarySlips.length" class="mt-3 divide-y divide-purple-50">
            <div v-for="slip in salarySlips.slice(0, 5)" :key="slip.name"
              class="flex items-center justify-between gap-3 py-3">
              <div class="min-w-0 flex-1">
                <strong class="block break-all text-sm font-black text-[#453D89]">
                  ₹{{ salaryVisible ? Number(slip.net_pay || 0).toLocaleString("en-IN") : "••••••" }}
                </strong>

                <p class="mt-1 text-[10px] text-gray-500">
                  {{ slip.start_date || "—" }} – {{ slip.end_date || "—" }}
                </p>

                <p class="mt-1 truncate text-[9px] text-gray-600">
                  {{ slip.name }}
                </p>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <button class="rounded-md px-2 py-1 text-[10px] font-bold text-[#C8499A] hover:bg-pink-50"
                  @click="salaryVisible = !salaryVisible">
                  {{ salaryVisible ? "Hide" : "Show" }}
                </button>

                <button
                  class="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#453D89] to-[#C8499A] px-3 py-2 text-[10px] font-bold text-white"
                  @click="downloadSalarySlip(slip.name)">
                  <span>↓</span>
                  PDF
                </button>
              </div>
            </div>
          </div>

          <p v-else class="mt-3 text-xs text-gray-600">
            No salary slips available.
          </p>
        </article>

        <!-- HOLIDAYS -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <CardHeading icon="♧" title="Holidays" link-label="View ↗" @open="openRoute('/app/holiday-list')" />
          <p class="mt-3 text-[10px] text-gray-600">Holidays within selected dates</p>
          <div v-if="holidays.length" class="mt-2 divide-y divide-purple-50">
            <div v-for="holiday in holidays.slice(0, 6)" :key="holiday.holiday_date + holiday.description"
              class="flex items-center gap-3 py-2">
              <div
                class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-purple-50 text-xs font-black text-[#453D89]">
                {{ datePart(holiday.holiday_date, "day") }}
                {{ datePart(holiday.holiday_date, "month") }}
              </div>
              <div class="min-w-0">
                <strong class="block text-xs text-gray-700">{{ holiday.description || "Holiday" }}</strong>
                <span class="text-[10px] text-gray-600">{{ formatDate(holiday.holiday_date) }}</span>
              </div>
            </div>
          </div>
          <p v-else class="mt-3 text-xs text-gray-600">No holidays in this date range.</p>
        </article>
      </section>
    </template>

    <!-- ADMIN / HR DASHBOARD -->
    <template v-else>
      <section class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button class="rounded-xl border border-[#eeeaf5] bg-white p-4 text-left shadow-sm"
          @click="openRoute('/app/employee')">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-purple-50 text-lg text-[#453D89]">♙</span>
          <strong class="mt-3 block text-sm font-extrabold">Employees</strong>
          <small class="mt-1 block text-xs text-gray-600">{{ metrics.employees }} records</small>
        </button>
        <button class="rounded-xl border border-[#eeeaf5] bg-white p-4 text-left shadow-sm"
          @click="openRoute('/app/leave-application')">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-pink-50 text-lg text-[#C8499A]">◷</span>
          <strong class="mt-3 block text-sm font-extrabold">Leave Requests</strong>
          <small class="mt-1 block text-xs text-gray-600">{{ metrics.pendingLeaves }} in range</small>
        </button>
        <button class="rounded-xl border border-[#eeeaf5] bg-white p-4 text-left shadow-sm"
          @click="openRoute('/app/attendance')">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-lg text-emerald-700">✓</span>
          <strong class="mt-3 block text-sm font-extrabold">Attendance</strong>
          <small class="mt-1 block text-xs text-gray-600">{{ metrics.attendanceRecords }} records</small>
        </button>
        <button class="rounded-xl border border-[#eeeaf5] bg-white p-4 text-left shadow-sm"
          @click="openRoute('/app/salary-slip')">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-lg text-orange-600">₹</span>
          <strong class="mt-3 block text-sm font-extrabold">Payroll</strong>
          <small class="mt-1 block text-xs text-gray-600">{{ metrics.salarySlips }} slips in range</small>
        </button>
      </section>

      <section class="mt-5">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-[9px] font-extrabold tracking-widest text-[#C8499A]">{{ isHR ? "HR OPERATIONS" :
              "ADMINOVERVIEW" }}</p>
            <h2 class="mt-1 text-xl font-black">Workforce Overview</h2>
            <p class="mt-1 text-[10px] text-gray-600">{{ formatDate(startDate) }} – {{ formatDate(endDate) }}</p>
          </div>
          <button class="rounded-lg border border-purple-100 bg-white px-3 py-2 text-xs font-bold text-[#453D89]"
            :disabled="loading || dateLoading" @click="loadDashboard">↻ Refresh</button>
        </div>

        <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <button v-for="metric in metricCards" :key="metric.label"
            class="min-w-0 rounded-xl border border-[#eeeaf5] bg-white p-4 text-left shadow-sm"
            @click="openRoute(metric.route)">
            <span class="grid h-9 w-9 place-items-center rounded-lg text-lg" :class="metric.color">{{ metric.icon
              }}</span>
            <span class="mt-3 block text-[10px] font-semibold text-gray-600">{{ metric.label }}</span>
            <strong class="mt-1 block break-words text-xl font-black">{{ metric.value }}</strong>
            <small class="mt-1 block text-[10px] text-[#453D89]">{{ metric.note }}</small>
          </button>
        </div>
      </section>

      <section class="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <!-- ATTENDANCE OVERVIEW -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h2 class="text-base font-black">Attendance Overview</h2>
              <p class="mt-1 text-[10px] text-gray-600">{{ formatDate(startDate) }} – {{ formatDate(endDate) }}</p>
            </div>
            <button class="text-xs font-bold text-[#C8499A]" @click="openRoute('/app/attendance')">View all ↗</button>
          </div>
          <div class="mt-4 space-y-3">
            <div class="flex items-center justify-between text-xs"><span>Present</span><strong>{{ metrics.present
                }}</strong></div>
            <div class="flex items-center justify-between text-xs"><span>Absent</span><strong>{{ metrics.absent
                }}</strong></div>
            <div class="flex items-center justify-between text-xs"><span>Other attendance records</span><strong>{{
              Math.max(0, metrics.attendanceRecords - metrics.present - metrics.absent) }}</strong></div>
          </div>
          <div class="mt-4 h-2 overflow-hidden rounded-full bg-purple-50">
            <div class="h-full rounded-full bg-gradient-to-r from-[#453D89] to-[#C8499A]"
              :style="{ width: attendancePercent + '%' }"></div>
          </div>
          <p class="mt-2 text-[10px] text-gray-600">{{ attendancePercent }}% present against total employee count for
            this range.</p>
        </article>

        <!-- HR ONLY: EMPLOYEE CHECK-IN / CHECK-OUT TABLE -->
        <section v-if="isHR" class="mt-4 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">

          <div class="border-b border-purple-50 p-4">
            <h2 class="text-base font-black text-[#453D89]">
              Employee Check-in / Check-out
            </h2>
            <p class="mt-1 text-xs text-gray-600">
              {{ formatDate(startDate) }} – {{ formatDate(endDate) }}
            </p>
          </div>

          <div class="max-h-[320px] overflow-auto">
            <table class="w-full min-w-[440px] text-left">
              <thead class="sticky top-0 z-10 bg-gradient-to-r from-[#453D89] to-[#C8499A] text-white">
                <tr>
                  <th class="px-4 py-3 text-xs">Employee Name</th>
                  <th class="px-4 py-3 text-xs">Check In</th>
                  <th class="px-4 py-3 text-xs">Check Out</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-purple-50">
                <tr v-for="row in adminEmployeeCheckins" :key="row.employee + '-' + row.date"
                  class="hover:bg-purple-50/50">

                  <td class="px-4 py-3 text-sm font-semibold">
                    {{ row.employee_name }}
                  </td>

                  <td class="px-4 py-3 text-xs font-bold text-emerald-700">
                    {{ row.check_in ? formatTime(row.check_in) : '—' }}
                  </td>

                  <td class="px-4 py-3 text-xs font-bold text-[#C8499A]">
                    {{ row.check_out ? formatTime(row.check_out) : '—' }}
                  </td>
                </tr>

                <tr v-if="employeeCheckinError">
                  <td colspan="3" class="px-4 py-8 text-center text-xs text-red-600">
                    {{ employeeCheckinError }}
                  </td>
                </tr>

                <tr v-else-if="!adminEmployeeCheckins.length">
                  <td colspan="3" class="px-4 py-8 text-center text-xs text-gray-600">
                    No employee check-in records found for this date range.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- LEAVE APPLICATIONS -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h2 class="text-base font-black">Leave Applications</h2>
              <p class="mt-1 text-[10px] text-gray-600">Applications overlapping the selected range</p>
            </div>
            <button class="text-xs font-bold text-[#C8499A]" @click="openRoute('/app/leave-application')">View all
              ↗</button>
          </div>
          <div v-if="adminLeaveApplications.length" class="mt-3 divide-y divide-purple-50">
            <div v-for="leave in adminLeaveApplications.slice(0, 6)" :key="leave.name"
              class="flex items-center justify-between gap-3 py-2">
              <div class="min-w-0">
                <strong class="block truncate text-xs">{{ leave.employee_name || leave.employee || "Employee"
                  }}</strong>
                <p class="mt-1 text-[10px] text-gray-600">{{ leave.leave_type }} · {{ leave.from_date }} – {{
                  leave.to_date }}</p>
              </div>
              <span class="shrink-0 rounded-full bg-purple-50 px-2 py-1 text-[9px] font-bold text-[#453D89]">{{
                leave.status || "Pending" }}</span>
            </div>
          </div>
          <p v-else class="mt-3 text-xs text-gray-600">No leave applications overlap this range.</p>
        </article>

        <!-- PAYROLL SUMMARY -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h2 class="text-base font-black">Payroll Summary</h2>
              <p class="mt-1 text-[10px] text-gray-600">Submitted salary slips overlapping the selected range</p>
            </div>
            <button class="text-xs font-bold text-[#C8499A]" @click="openRoute('/app/salary-slip')">View all ↗</button>
          </div>
          <strong class="mt-4 block text-2xl font-black text-[#453D89]">₹{{ Number(metrics.payroll ||
            0).toLocaleString("en-IN") }}</strong>
          <p class="mt-1 text-xs text-gray-600">{{ metrics.salarySlips }} salary slips</p>
          <div v-if="adminSalarySlips.length" class="mt-3 divide-y divide-purple-50">
            <div v-for="slip in adminSalarySlips.slice(0, 5)" :key="slip.name"
              class="flex items-center justify-between gap-2 py-2">
              <div class="min-w-0">
                <strong class="block truncate text-xs">{{ slip.employee_name || slip.employee || slip.name }}</strong>
                <p class="mt-1 text-[10px] text-gray-600">{{ slip.start_date }} – {{ slip.end_date }}</p>
              </div>
              <strong class="text-xs text-[#453D89]">₹{{ Number(slip.net_pay || 0).toLocaleString("en-IN") }}</strong>
            </div>
          </div>
          <p v-else class="mt-3 text-xs text-gray-600">No salary slips overlap this range.</p>
        </article>

        <!-- HOLIDAYS -->
        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h2 class="text-base font-black">Holidays</h2>
              <p class="mt-1 text-[10px] text-gray-600">Calendar holidays within selected dates</p>
            </div>
            <button class="text-xs font-bold text-[#C8499A]" @click="openRoute('/app/holiday-list')">View all ↗</button>
          </div>
          <div v-if="holidays.length" class="mt-3 divide-y divide-purple-50">
            <div v-for="holiday in holidays.slice(0, 6)" :key="holiday.holiday_date + holiday.description"
              class="flex items-center gap-3 py-2">
              <div
                class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-purple-50 text-xs font-black text-[#453D89]">
                {{ datePart(holiday.holiday_date, "day") }} {{ datePart(holiday.holiday_date, "month") }}
              </div>
              <div>
                <strong class="block text-xs text-gray-700">{{ holiday.description || "Holiday" }}</strong>
                <span class="text-[10px] text-gray-600">{{ formatDate(holiday.holiday_date) }}</span>
              </div>
            </div>
          </div>
          <p v-else class="mt-3 text-xs text-gray-600">No holidays found in this range for the available holiday lists.
          </p>
        </article>


        <article class="rounded-xl border border-[#eeeaf5] bg-white p-4 shadow-sm xl:col-span-2">
          <!-- Header -->
          <div class="flex items-center justify-between gap-2">
            <div>
              <h2 class="text-base font-black text-[#25213a]">Quick Links</h2>
              <p class="mt-1 text-[10px] text-gray-600">
                Access your HRMS tools quickly
              </p>
            </div>
            <span class="rounded-full bg-purple-50 px-3 py-1 text-[10px] font-bold text-[#453D89]">
              Shortcuts
            </span>
          </div>

          <!-- Quick Link Grid -->
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

            <!-- Employees -->
            <button @click="openRoute('/app/employee')"
              class="group flex items-center gap-3 rounded-xl border border-purple-100 bg-[#faf9fd] p-3 text-left transition hover:border-[#453D89] hover:bg-purple-50">
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#453D89] to-[#C8499A] text-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="10" cy="7" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <span class="min-w-0">
                <strong class="block text-xs font-bold text-[#453D89]">Employees</strong>
                <span class="mt-1 block text-[10px] text-gray-600">Employee directory</span>
              </span>
            </button>

            <!-- Attendance -->
            <button @click="openRoute('/app/attendance')"
              class="group flex items-center gap-3 rounded-xl border border-purple-100 bg-[#faf9fd] p-3 text-left transition hover:border-[#453D89] hover:bg-purple-50">
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#453D89] to-[#C8499A] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18l-7 5-3-2-4 4" />
                </svg>
              </span>
              <span class="min-w-0">
                <strong class="block text-xs font-bold text-[#453D89]">Attendance</strong>
                <span class="mt-1 block text-[10px] text-gray-600">Daily attendance</span>
              </span>
            </button>

            <!-- Leave Applications -->
            <button @click="openRoute('/app/leave-application')"
              class="group flex items-center gap-3 rounded-xl border border-purple-100 bg-[#faf9fd] p-3 text-left transition hover:border-[#453D89] hover:bg-purple-50">
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#453D89] to-[#C8499A] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="5" width="16" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M4 10h16M9 15l2 2 4-4" />
                </svg>
              </span>
              <span class="min-w-0">
                <strong class="block text-xs font-bold text-[#453D89]">Leave Requests</strong>
                <span class="mt-1 block text-[10px] text-gray-600">Manage leave</span>
              </span>
            </button>

            <!-- Salary Slips -->
            <button @click="openRoute('/app/salary-slip')"
              class="group flex items-center gap-3 rounded-xl border border-purple-100 bg-[#faf9fd] p-3 text-left transition hover:border-[#453D89] hover:bg-purple-50">
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#453D89] to-[#C8499A] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18M7 15h3" />
                  <path d="M16 14v3m-1.5-1.5h3" />
                </svg>
              </span>
              <span class="min-w-0">
                <strong class="block text-xs font-bold text-[#453D89]">Salary Slips</strong>
                <span class="mt-1 block text-[10px] text-gray-600">Payroll records</span>
              </span>
            </button>

          </div>
        </article>

      </section>
    </template>
  </main>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  defineComponent,
  h,
} from "vue";

/* -------------------------------------------------------
   REUSABLE CARD HEADING
------------------------------------------------------- */
const CardHeading = defineComponent({
  props: {
    icon: { type: String, default: "•" },
    title: { type: String, required: true },
    linkLabel: { type: String, default: "" },
  },
  emits: ["open"],
  setup(props, { emit }) {
    return () =>
      h("div", { class: "flex items-center justify-between gap-3" }, [
        h("div", { class: "flex min-w-0 items-center gap-3" }, [
          h("span", {
            class: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-purple-50 text-base font-bold text-[#453D89]",
          }, props.icon),
          h("h3", { class: "text-sm font-extrabold" }, props.title),
        ]),
        props.linkLabel
          ? h("button", {
            class: "shrink-0 text-[10px] font-bold text-[#C8499A] hover:underline",
            onClick: () => emit("open"),
          }, props.linkLabel)
          : null,
      ]);
  },
});

/* -------------------------------------------------------
   STATE
------------------------------------------------------- */
const loading = ref(false);
const dateLoading = ref(false);
const checkinLoading = ref(false);
const locationLoading = ref(false);
const errorMessage = ref("");
const filterError = ref("");
const filterApplied = ref(false);

const attendanceMessage = ref("");
const attendanceMessageType = ref("success");
let attendanceMessageTimer = null;

const loggedUser = ref("");
const userRoles = ref([]);
const userImage = ref("");
const employee = ref({});

const isEmployee = ref(false);
const isHR = ref(false);
const hasAdminRole = ref(false);

const todayISO = localDate();
const startDate = ref(todayISO);
const endDate = ref(todayISO);

const notifications = ref([]);
const unreadCount = ref(0);
const notificationsOpen = ref(false);
const notificationsLoading = ref(false);

const attendanceSummary = ref({
  present: 0,
  absent: 0,
  half_day: 0,
  total: 0,
});

const metrics = ref({
  employees: 0,
  departments: 0,
  present: 0,
  absent: 0,
  pendingLeaves: 0,
  attendanceRecords: 0,
  payroll: 0,
  salarySlips: 0,
});

const employeeTasks = ref([]);
const leaveBalances = ref([]);
const leaveApplications = ref([]);
const adminLeaveApplications = ref([]);
const holidays = ref([]);
const salarySlips = ref([]);
const adminSalarySlips = ref([]);
const currentShift = ref(null);
const lastCheckin = ref(null);
const dateCheckins = ref([]);
const adminEmployeeCheckins = ref([]);
const employeeCheckinError = ref("");
const salaryVisible = ref(false);

let notificationTimer = null;

/* -------------------------------------------------------
   COMPUTED VALUES
------------------------------------------------------- */
const hasEmployeeRecord = computed(() => Boolean(employee.value.name));

const rangeIncludesToday = computed(() =>
  startDate.value <= todayISO && endDate.value >= todayISO
);

const displayName = computed(() =>
  employee.value.employee_name ||
  (loggedUser.value && loggedUser.value !== "Guest"
    ? loggedUser.value.split("@")[0]
    : "there")
);

const initials = computed(() =>
  String(displayName.value || "U").trim().slice(0, 1).toUpperCase()
);

const roleLabel = computed(() => {
  if (isEmployee.value) return "EMPLOYEE WORKSPACE";
  if (isHR.value) return "HUMAN RESOURCES WORKSPACE";
  return "ADMINISTRATOR OVERVIEW";
});

const roleDisplay = computed(() => {
  if (isEmployee.value) return "Employee";
  if (isHR.value) return "HR Workspace";
  return "Administrator";
});

const heroTitle = computed(() => {
  if (isEmployee.value) return "Your workday,";
  if (isHR.value) return "People first.";
  return "A better view of";
});

const heroSubtitle = computed(() => {
  if (isEmployee.value) return "at a glance.";
  if (isHR.value) return "work made easier.";
  return "your workforce.";
});

const heroDescription = computed(() => {
  if (isEmployee.value) return "Your attendance, leave, and payroll in one place.";
  if (isHR.value) return "Manage employee operations from one workspace.";
  return "Your workforce overview and administrative tools.";
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
});

const todayLabel = computed(() =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
);

const isCheckedIn = computed(() => lastCheckin.value?.log_type === "IN");

const attendancePercent = computed(() =>
  metrics.value.employees
    ? Math.min(100, Math.round((metrics.value.present / metrics.value.employees) * 100))
    : 0
);

const metricCards = computed(() => [
  {
    label: "Total Employees",
    value: metrics.value.employees,
    note: "Employee records",
    icon: "♙",
    color: "bg-purple-50 text-[#453D89]",
    route: "/app/employee",
  },
  {
    label: "Departments",
    value: metrics.value.departments,
    note: "Organisation structure",
    icon: "▦",
    color: "bg-pink-50 text-[#C8499A]",
    route: "/app/department",
  },
  {
    label: "Present",
    value: metrics.value.present,
    note: "Selected date range",
    icon: "✓",
    color: "bg-emerald-50 text-emerald-700",
    route: "/app/attendance",
  },
  {
    label: "Absent",
    value: metrics.value.absent,
    note: "Selected date range",
    icon: "×",
    color: "bg-red-50 text-red-600",
    route: "/app/attendance",
  },
  {
    label: "Leave Applications",
    value: metrics.value.pendingLeaves,
    note: "Overlapping selected range",
    icon: "◷",
    color: "bg-orange-50 text-orange-600",
    route: "/app/leave-application",
  },
  {
    label: "Submitted Payroll",
    value: "₹" + Number(metrics.value.payroll || 0).toLocaleString("en-IN"),
    note: `${metrics.value.salarySlips} slips in range`,
    icon: "₹",
    color: "bg-purple-50 text-[#453D89]",
    route: "/app/salary-slip",
  },
]);

/* -------------------------------------------------------
   DATE / FORMAT HELPERS
------------------------------------------------------- */
function localDate(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value) {
  if (!value) return "—";
  const match = String(value).match(/(?:T|\s)?(\d{1,2}):(\d{2})/);
  if (!match) return String(value);
  let hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${suffix}`;
}

function datePart(value, part) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return part === "day"
    ? date.getDate()
    : date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
}

function openRoute(route) {
  if (route) window.location.href = route;
}

function validateDateRange() {
  filterError.value = "";

  if (!startDate.value || !endDate.value) {
    filterError.value = "Please select both a start date and an end date.";
    return false;
  }

  if (startDate.value > endDate.value) {
    filterError.value = "Start date cannot be later than end date.";
    return false;
  }

  return true;
}

/* -------------------------------------------------------
   FRAPPE API HELPERS
------------------------------------------------------- */
function parseServerMessage(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed.map((message) => {
      try {
        const item = JSON.parse(message);
        return item.message || message;
      } catch {
        return message;
      }
    }).join(" ");
  } catch {
    return value;
  }
}

async function frappeRequest(url, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (options.method && options.method !== "GET") {
    headers["Content-Type"] = "application/json";
    const csrf = window.frappe?.csrf_token;
    if (csrf) headers["X-Frappe-CSRF-Token"] = csrf;
  }

  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    // Response did not contain JSON.
  }

  if (!response.ok || payload.exc) {
    const message = payload._server_messages
      ? parseServerMessage(payload._server_messages)
      : payload.exception || payload.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

function queryString(params) {
  return new URLSearchParams(
    Object.entries(params).map(([key, value]) => [
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    ])
  ).toString();
}

async function getList(
  doctype,
  {
    fields = ["name"],
    filters = [],
    orderBy = "modified desc",
    limit = 100,
  } = {}
) {
  const query = queryString({
    fields,
    filters,
    order_by: orderBy,
    limit_page_length: limit,
  });

  const response = await frappeRequest(
    `/api/resource/${encodeURIComponent(doctype)}?${query}`
  );
  return response.data || [];
}

async function getCount(doctype, filters = []) {
  const query = queryString({ doctype, filters });
  const response = await frappeRequest(
    `/api/method/frappe.client.get_count?${query}`
  );
  return Number(response.message || 0);
}

function rangeOverlapFilters(fromField, toField) {
  return [
    [fromField, "<=", endDate.value],
    [toField, ">=", startDate.value],
  ];
}

/* -------------------------------------------------------
   USER / ROLE DETECTION
------------------------------------------------------- */
async function getLoggedInUser() {
  const response = await frappeRequest("/api/method/frappe.auth.get_logged_user");
  loggedUser.value = response.message || "";

  if (!loggedUser.value || loggedUser.value === "Guest") {
    throw new Error("Please log in to view your HRMS dashboard.");
  }

  userImage.value = "";
  employee.value = {};
  userRoles.value = [];

  try {
    const fields = encodeURIComponent(JSON.stringify(["name", "full_name", "user_image"]));
    const userResponse = await frappeRequest(
      `/api/resource/User/${encodeURIComponent(loggedUser.value)}?fields=${fields}`
    );
    userImage.value = userResponse.data?.user_image || "";
  } catch (error) {
    console.warn("Could not load user profile:", error);
  }

  const bootRoles = window.frappe?.boot?.user?.roles;
  userRoles.value = Array.isArray(bootRoles) ? bootRoles : [];
  const roles = userRoles.value.map((role) => String(role).toLowerCase());

  hasAdminRole.value =
    loggedUser.value === "Administrator" || roles.includes("system manager");

  isHR.value =
    !hasAdminRole.value &&
    roles.some((role) => ["hr manager", "hr user", "employee manager"].includes(role));

  // Find a linked Employee record for any login, including HR/Admin accounts.
  try {
    const matches = await getList("Employee", {
      fields: [
        "name", "employee_name", "user_id", "department", "designation",
        "status", "date_of_joining", "company", "holiday_list",
      ],
      filters: [["user_id", "=", loggedUser.value]],
      limit: 1,
    });
    employee.value = matches[0] || {};
  } catch (error) {
    console.warn("Could not load linked Employee:", error);
  }

  isEmployee.value = Boolean(employee.value.name) && !hasAdminRole.value && !isHR.value;
}

/* -------------------------------------------------------
   NOTIFICATIONS
------------------------------------------------------- */
function isRead(notification) {
  return notification?.read === 1 || notification?.read === true || notification?.read === "1";
}

function notificationMessage(notification) {
  const content = notification.email_content || notification.message || "";
  if (!content) return "You have a new notification.";
  const plain = String(content).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > 120 ? plain.slice(0, 117) + "..." : plain;
}

async function loadNotifications() {
  if (!loggedUser.value || loggedUser.value === "Guest") return;

  notificationsLoading.value = true;
  try {
    notifications.value = await getList("Notification Log", {
      fields: [
        "name", "subject", "email_content", "creation", "read",
        "document_type", "document_name", "type",
      ],
      filters: [["for_user", "=", loggedUser.value]],
      orderBy: "creation desc",
      limit: 30,
    });

    unreadCount.value = notifications.value.filter((item) => !isRead(item)).length;
  } catch (error) {
    console.error("Could not load notifications. Check Notification Log permissions and fields:", error);
  } finally {
    notificationsLoading.value = false;
  }
}

async function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value;
  if (notificationsOpen.value) await loadNotifications();
}

async function markNotificationRead(notification) {
  if (!notification?.name || isRead(notification)) return;

  try {
    await frappeRequest(
      `/api/resource/Notification%20Log/${encodeURIComponent(notification.name)}`,
      {
        method: "PUT",
        body: JSON.stringify({ read: 1 }),
      }
    );

    notification.read = 1;
    unreadCount.value = notifications.value.filter((item) => !isRead(item)).length;
  } catch (error) {
    console.error("Could not mark notification as read:", error);
  }
}

async function markAllNotificationsRead() {
  for (const notification of notifications.value.filter((item) => !isRead(item))) {
    await markNotificationRead(notification);
  }
}

async function openNotification(notification) {
  await markNotificationRead(notification);
  notificationsOpen.value = false;

  if (notification.document_type && notification.document_name) {
    const route = `/app/${notification.document_type.toLowerCase().replace(/\s+/g, "-")}/${encodeURIComponent(notification.document_name)}`;
    openRoute(route);
  }
}

/* -------------------------------------------------------
   EMPLOYEE DATA FOR SELECTED DATE RANGE
------------------------------------------------------- */
async function loadEmployeeDashboard() {
  if (!employee.value.name) return;

  const id = employee.value.name;
  const start = startDate.value;
  const end = endDate.value;

  const results = await Promise.allSettled([
    // Tasks with a due date in the selected range.
    getList("ToDo", {
      fields: ["name", "description", "status", "date"],
      filters: [
        ["allocated_to", "=", loggedUser.value],
        ["status", "!=", "Closed"],
        ["date", ">=", start],
        ["date", "<=", end],
      ],
      orderBy: "date asc",
      limit: 20,
    }),

    // Attendance in range.
    getList("Attendance", {
      fields: ["name", "attendance_date", "status"],
      filters: [
        ["employee", "=", id],
        ["attendance_date", ">=", start],
        ["attendance_date", "<=", end],
        ["docstatus", "=", 1],
      ],
      orderBy: "attendance_date desc",
      limit: 1000,
    }),

    // Submitted salary slips whose salary period overlaps the range.
    getList("Salary Slip", {
      fields: ["name", "employee", "net_pay", "start_date", "end_date", "docstatus"],
      filters: [
        ["employee", "=", id],
        ["docstatus", "=", 1],
        ["start_date", "<=", end],
        ["end_date", ">=", start],
      ],
      orderBy: "start_date desc",
      limit: 1000,
    }),

    // Check-in records within the selected range.
    getList("Employee Checkin", {
      fields: ["name", "time", "log_type", "latitude", "longitude"],
      filters: [
        ["employee", "=", id],
        ["time", ">=", `${start} 00:00:00`],
        ["time", "<=", `${end} 23:59:59`],
      ],
      orderBy: "time desc",
      limit: 1000,
    }),

    // Leave applications overlapping the selected range.
    getList("Leave Application", {
      fields: ["name", "employee", "leave_type", "from_date", "to_date", "status", "docstatus"],
      filters: [
        ["employee", "=", id],
        ...rangeOverlapFilters("from_date", "to_date"),
      ],
      orderBy: "from_date desc",
      limit: 1000,
    }),

    // Leave allocations overlapping the selected range.
    getList("Leave Allocation", {
      fields: [
        "name", "leave_type", "total_leaves_allocated",
        "new_leaves_allocated", "from_date", "to_date", "docstatus",
      ],
      filters: [
        ["employee", "=", id],
        ["docstatus", "=", 1],
        ...rangeOverlapFilters("from_date", "to_date"),
      ],
      orderBy: "leave_type asc",
      limit: 1000,
    }),
  ]);

  employeeTasks.value = results[0].status === "fulfilled" ? results[0].value : [];

  const attendance = results[1].status === "fulfilled" ? results[1].value : [];
  attendanceSummary.value = {
    present: attendance.filter((row) => row.status === "Present").length,
    absent: attendance.filter((row) => row.status === "Absent").length,
    half_day: attendance.filter((row) => row.status === "Half Day").length,
    total: attendance.length,
  };

  salarySlips.value = results[2].status === "fulfilled" ? results[2].value : [];
  dateCheckins.value = results[3].status === "fulfilled" ? results[3].value : [];
  leaveApplications.value = results[4].status === "fulfilled" ? results[4].value : [];

  const allocations = results[5].status === "fulfilled" ? results[5].value : [];
  leaveBalances.value = allocations.map((row) => ({
    ...row,
    allocated: row.new_leaves_allocated ?? row.total_leaves_allocated ?? 0,
    leave_type: row.leave_type || "Leave",
  }));

  // Only today's check-in state determines the live check-in/out button.
  lastCheckin.value = rangeIncludesToday.value
    ? dateCheckins.value
      .filter((row) => String(row.time || "").slice(0, 10) === todayISO)
      .sort((a, b) => String(a.time).localeCompare(String(b.time)))[
    dateCheckins.value.filter((row) => String(row.time || "").slice(0, 10) === todayISO).length - 1
    ] || null
    : null;

  await loadShiftForRange(id, start, end);
  await loadHolidays();
}

// salary slip download helper
const downloadSalarySlip = (slipName) => {
  if (!slipName) return;

  const url =
    `/api/method/frappe.utils.print_format.download_pdf` +
    `?doctype=Salary%20Slip` +
    `&name=${encodeURIComponent(slipName)}` +
    `&format=Standard` +
    `&no_letterhead=0`;

  window.open(url, "_blank");
};

/* -------------------------------------------------------
   SHIFT AND HOLIDAYS
------------------------------------------------------- */
async function loadShiftForRange(employeeId, start, end) {
  try {
    const assignments = await getList("Shift Assignment", {
      fields: ["name", "shift_type", "start_date", "end_date", "docstatus"],
      filters: [
        ["employee", "=", employeeId],
        ["docstatus", "=", 1],
        ["start_date", "<=", end],
        ["end_date", ">=", start],
      ],
      orderBy: "start_date desc",
      limit: 20,
    });

    currentShift.value = assignments[0] || null;

    if (currentShift.value?.shift_type) {
      const response = await frappeRequest(
        `/api/resource/Shift%20Type/${encodeURIComponent(currentShift.value.shift_type)}`
      );
      currentShift.value = { ...currentShift.value, ...response.data };
    }
  } catch (error) {
    console.warn("Could not load shift assignment:", error);
    currentShift.value = null;
  }
}

async function loadHolidays() {
  const holidayListNames = new Set();

  if (employee.value.holiday_list) {
    holidayListNames.add(employee.value.holiday_list);
  } else if (!isEmployee.value) {
    // Admin/HR: gather holiday lists used by active employees.
    try {
      const employees = await getList("Employee", {
        fields: ["name", "holiday_list"],
        filters: [["status", "=", "Active"]],
        limit: 1000,
      });
      employees.forEach((item) => {
        if (item.holiday_list) holidayListNames.add(item.holiday_list);
      });
    } catch (error) {
      console.warn("Could not retrieve employee holiday lists:", error);
    }
  }

  const unique = new Map();

  for (const listName of holidayListNames) {
    try {
      const response = await frappeRequest(
        `/api/resource/Holiday%20List/${encodeURIComponent(listName)}`
      );
      const rows = response.data?.holidays || [];

      rows
        .filter((holiday) =>
          holiday.holiday_date &&
          holiday.holiday_date >= startDate.value &&
          holiday.holiday_date <= endDate.value
        )
        .forEach((holiday) => {
          const key = `${holiday.holiday_date}|${holiday.description || ""}`;
          if (!unique.has(key)) unique.set(key, holiday);
        });
    } catch (error) {
      console.warn(`Could not load holidays from ${listName}:`, error);
    }
  }

  holidays.value = [...unique.values()].sort((a, b) =>
    String(a.holiday_date).localeCompare(String(b.holiday_date))
  );
}

/* -------------------------------------------------------
   ADMIN / HR DATA FOR SELECTED RANGE
------------------------------------------------------- */
async function loadAdminDashboard() {
  const start = startDate.value;
  const end = endDate.value;

  const results = await Promise.allSettled([
    getCount("Employee"),
    getCount("Department"),

    getCount("Attendance", [
      ["attendance_date", ">=", start],
      ["attendance_date", "<=", end],
      ["status", "=", "Present"],
      ["docstatus", "=", 1],
    ]),

    getCount("Attendance", [
      ["attendance_date", ">=", start],
      ["attendance_date", "<=", end],
      ["status", "=", "Absent"],
      ["docstatus", "=", 1],
    ]),

    getList("Leave Application", {
      fields: ["name", "employee", "leave_type", "from_date", "to_date", "status", "docstatus"],
      filters: rangeOverlapFilters("from_date", "to_date"),
      orderBy: "from_date desc",
      limit: 1000,
    }),

    getCount("Attendance", [
      ["attendance_date", ">=", start],
      ["attendance_date", "<=", end],
      ["docstatus", "=", 1],
    ]),

    getList("Salary Slip", {
      fields: ["name", "employee", "net_pay", "gross_pay", "start_date", "end_date", "docstatus"],
      filters: [
        ["docstatus", "=", 1],
        ["start_date", "<=", end],
        ["end_date", ">=", start],
      ],
      orderBy: "start_date desc",
      limit: 1000,
    }),
  ]);

  const value = (index, fallback = null) =>
    results[index].status === "fulfilled" ? results[index].value : fallback;

  metrics.value.employees = value(0, 0);
  metrics.value.departments = value(1, 0);
  metrics.value.present = value(2, 0);
  metrics.value.absent = value(3, 0);

  adminLeaveApplications.value = value(4, []);
  metrics.value.pendingLeaves = adminLeaveApplications.value.filter((leave) =>
    ["Open", "Pending", "Draft"].includes(String(leave.status || ""))
  ).length;

  metrics.value.attendanceRecords = value(5, 0);
  adminSalarySlips.value = value(6, []);
  metrics.value.salarySlips = adminSalarySlips.value.length;
  metrics.value.payroll = adminSalarySlips.value.reduce(
    (total, slip) => total + Number(slip.gross_pay || 0),
    0
  );

  await loadHolidays();
}

async function loadAdminEmployeeCheckins() {
  employeeCheckinError.value = "";

  try {
    const records = await getList("Employee Checkin", {
      fields: ["employee", "employee_name", "time", "log_type"],
      filters: [
        ["time", ">=", `${startDate.value} 00:00:00`],
        ["time", "<=", `${endDate.value} 23:59:59`],
      ],
      orderBy: "time asc",
      limit: 1000,
    });

    const checkinsByEmployeeAndDate = new Map();

    for (const record of records) {
      if (!record.employee || !record.time) continue;

      const date = String(record.time).slice(0, 10);
      const key = `${record.employee}|${date}`;
      let checkin = checkinsByEmployeeAndDate.get(key);

      if (!checkin) {
        checkin = {
          employee: record.employee,
          employee_name: record.employee_name || record.employee,
          date,
          check_in: "",
          check_out: "",
        };
        checkinsByEmployeeAndDate.set(key, checkin);
      }

      if (record.log_type === "IN" && (!checkin.check_in || record.time < checkin.check_in)) {
        checkin.check_in = record.time;
      } else if (record.log_type === "OUT" && record.time > checkin.check_out) {
        checkin.check_out = record.time;
      }
    }

    adminEmployeeCheckins.value = [...checkinsByEmployeeAndDate.values()].sort(
      (a, b) => b.date.localeCompare(a.date) || a.employee_name.localeCompare(b.employee_name)
    );
  } catch (error) {
    console.warn("Could not load employee check-in records:", error);
    adminEmployeeCheckins.value = [];
    employeeCheckinError.value = "Could not load employee check-in records. Check your permissions and retry.";
  }
}

/* -------------------------------------------------------
   APPLY / RESET GLOBAL DATE FILTER
------------------------------------------------------- */
async function applyDateFilter() {
  if (!validateDateRange()) return;

  dateLoading.value = true;
  errorMessage.value = "";

  try {
    // Apply the same range to every date-based section.
    if (isEmployee.value) {
      await loadEmployeeDashboard();
    } else {
      await loadAdminDashboard();
      if (isHR.value) {
        await loadAdminEmployeeCheckins();
      }
    }
    filterApplied.value = true;
  } catch (error) {
    console.error("Could not apply date range:", error);
    errorMessage.value = error.message || "Unable to load data for this date range.";
  } finally {
    dateLoading.value = false;
  }
}

async function resetDate() {
  startDate.value = todayISO;
  endDate.value = todayISO;
  filterError.value = "";
  await applyDateFilter();
}

/* -------------------------------------------------------
   GPS / ATTENDANCE
------------------------------------------------------- */
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Your browser does not support location access."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          reject(new Error("The browser returned invalid GPS coordinates."));
          return;
        }

        resolve({ latitude, longitude });
      },
      (error) => {
        const messages = {
          1: "Location permission denied. Allow location access in browser settings.",
          2: "Your location is unavailable. Enable device location and try again.",
          3: "The location request timed out. Please try again.",
        };

        reject(new Error(messages[error.code] || "Could not access your current location."));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  });
}

function getLocalDateTime() {
  const now = new Date();
  const pad = (number) => String(number).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function showAttendanceMessage(message, type = "success") {
  if (attendanceMessageTimer) clearTimeout(attendanceMessageTimer);

  attendanceMessageType.value = type;
  attendanceMessage.value = message;

  attendanceMessageTimer = setTimeout(() => {
    attendanceMessage.value = "";
    attendanceMessageTimer = null;
  }, 3000);
}

async function recordCheckin() {
  if (
    !employee.value.name ||
    checkinLoading.value ||
    locationLoading.value ||
    loading.value
  ) return;

  if (!rangeIncludesToday.value) {
    showAttendanceMessage("Include today in the date range to record attendance.", "error");
    return;
  }

  const logType = isCheckedIn.value ? "OUT" : "IN";
  const actionLabel = logType === "IN" ? "check-in" : "check-out";

  if (attendanceMessageTimer) clearTimeout(attendanceMessageTimer);
  attendanceMessage.value = "";
  locationLoading.value = true;

  try {
    const { latitude, longitude } = await getCurrentLocation();
    locationLoading.value = false;
    checkinLoading.value = true;

    await frappeRequest("/api/resource/Employee%20Checkin", {
      method: "POST",
      body: JSON.stringify({
        employee: employee.value.name,
        time: getLocalDateTime(),
        log_type: logType,
        latitude,
        longitude,
      }),
    });

    showAttendanceMessage(
      `${logType === "IN" ? "Check-in" : "Check-out"} recorded successfully.`,
      "success"
    );

    await loadEmployeeDashboard();
  } catch (error) {
    console.error("Attendance action failed:", error);
    showAttendanceMessage(`Could not record ${actionLabel}: ${error.message}`, "error");
  } finally {
    locationLoading.value = false;
    checkinLoading.value = false;
  }
}

/* -------------------------------------------------------
   INITIAL DASHBOARD LOAD
------------------------------------------------------- */
async function loadDashboard() {
  if (loading.value) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    await getLoggedInUser();

    // On first entry, startDate and endDate both default to today.
    startDate.value = todayISO;
    endDate.value = todayISO;

    if (isEmployee.value) {
      await loadEmployeeDashboard();
    } else {
      await loadAdminDashboard();
      if (isHR.value) {
        await loadAdminEmployeeCheckins();
      }
    }
    await loadNotifications();
    filterApplied.value = true;
  } catch (error) {
    console.error("HRMS dashboard error:", error);
    errorMessage.value = error.message || "Unable to load the dashboard.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadDashboard();

  notificationTimer = setInterval(() => {
    if (!notificationsOpen.value) loadNotifications();
  }, 60000);
});

onBeforeUnmount(() => {
  if (attendanceMessageTimer) clearTimeout(attendanceMessageTimer);
  if (notificationTimer) clearInterval(notificationTimer);
});
</script>

<style scoped>
.attendance-message-enter-active,
.attendance-message-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.attendance-message-enter-from,
.attendance-message-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

input[type="date"] {
  color-scheme: light;
}
</style>
