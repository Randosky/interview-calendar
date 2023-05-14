import {createSlice} from "@reduxjs/toolkit";
import {BackMonths, DAYS_IN_MONTH, Months, Time, WEEK_DAYS_FROM_MONDAY} from "../helpers/calendarHelper";

const calendarSlice = createSlice({
    name: "calendarSlice",
    initialState: {
        allMonthData: [[]],
        daysInMonth: null,
        monthStartsOn: null,
        isLeapYear: false,
        day: new Date().getDate(),
        month: 5,
        year: 2023,
        monthInString: "May",
        currentWeekDays: [],
        tableData: [[]],
        isAddEvent: false,
        allEvents: [],
        currentEvent: "",
        currentId: 1,
    },
    reducers: {
        updateToToday(state){
            state.day = new Date().getDate();
            state.month = 5;
            state.year = 2023;
        },
        updateCurrentEvent(state, action) {
            state.currentEvent = action.payload;
        },
        addEvent(state, action) {
            if (!("id" in localStorage))
                localStorage.setItem("id", "1")

            state.allEvents.push({
                id: Number(localStorage.getItem("id")),
                date: action.payload.slice(0, 10),
                time: action.payload.slice(11, 16),
            })


            if ("id" in localStorage)
                localStorage.setItem("id", (Number(localStorage.getItem("id")) + 1).toString())
            else
                localStorage.setItem("id", "0")
        },
        deleteEvent(state, action) {
            if (action.payload[1] !== -1)
                state.allEvents = state.allEvents.filter(elem => elem.id !== action.payload[1])
        },
        updateIsAddEvent(state) {
            state.isAddEvent = !state.isAddEvent
        },
        getCurrentWeekDays(state) {
            state.allMonthData.map(week => {
                if (week.includes(state.day)) {
                    state.currentWeekDays = week
                }
            })
        },
        getAllYearData(state) {
            let day = 1
            for (let i = 0; i < ((state.daysInMonth + state.monthStartsOn) / 7) + 1; i++) {
                state.allMonthData[i] = [];

                for (let j = 0; j < 7; j++) {
                    if ((i === 0 && j < state.monthStartsOn) || day > state.daysInMonth) {
                        state.allMonthData[i][j] = undefined;
                    } else {
                        state.allMonthData[i][j] = day++;
                    }
                }
            }
        },
        getDaysInMonth(state) {
            if (state.isLeapYear && state.month === Months.February) {
                state.daysInMonth = DAYS_IN_MONTH[state.month - 1] + 1;
            } else {
                state.daysInMonth = DAYS_IN_MONTH[state.month - 1];
            }
        },
        getDayOfWeek(state) {
            const date = new Date(state.year, state.month - 1)
            const dayOfWeek = date.getDay();

            state.monthStartsOn = WEEK_DAYS_FROM_MONDAY[dayOfWeek];
        },
        isLeapYear(state) {
            state.isLeapYear = !((state.year % 4) || (!(state.year % 100) && (state.year % 400)));
        },
        handlePrevMonthButtonClick(state) {
            if (state.month === 1) {
                state.month = 12
                state.year = state.year - 1
            } else {
                state.month = state.month - 1
            }
            state.monthInString = BackMonths[state.month]
        },
        handleNextMonthButtonClick(state) {
            if (state.month === 12) {
                state.month = 1
                state.year = state.year + 1
            } else {
                state.month = state.month + 1
            }
            state.monthInString = BackMonths[state.month - 1]
        },
        handlePrevDayButtonClick(state) {
            if (state.day > 1) {
                state.day -= 1
            } else {
                if (state.month === 1) {
                    state.month = 12
                    state.year = state.year - 1
                } else {
                    state.month = state.month - 1
                }
                state.day = DAYS_IN_MONTH[state.month - 1]
                state.monthInString = BackMonths[state.month]
            }
        },
        handleNextDayButtonClick(state) {
            if (state.day < DAYS_IN_MONTH[state.month - 1]) {
                state.day += 1
            } else {
                if (state.month === 12) {
                    state.month = 1
                    state.year = state.year + 1
                } else {
                    state.month = state.month + 1
                }
                state.day = 1
                state.monthInString = BackMonths[state.month - 1]
            }
        },
        handlePrevYearButtonClick(state) {
            state.year -= 1
        },
        handleNextYearButtonClick(state) {
            state.year += 1
        },
        handleSelectChangeMonth(state, action) {
            state.month = action.payload;
            state.monthInString = BackMonths[state.month]
        },
        handleSelectChangeYear(state, action) {
            state.year = action.payload;
        },
        setSelectedDay(state, action) {
            state.day = action.payload
        },
        updateTableData(state) {
            for (let i = 0; i < Time.length; i++) {
                state.tableData[i] = [];
                for (let j = 0; j < 8; j++) {
                    if (j === 0)
                        state.tableData[i][j] = [Time[i], -1];
                    else {
                        if (state.allEvents.length !== 0) {
                            if (state.month === Number(state.allEvents[0].date.slice(5, 7)) &&
                                state.year === Number(state.allEvents[0].date.slice(0, 4)) &&
                                state.day === Number(state.allEvents[0].date.slice(8, 10)) &&
                                Time[i] === state.allEvents[0].time.slice(0, 2) + ":00" &&
                                j === state.day % 7)
                                state.tableData[i][j] = ["Событие", state.allEvents[0].id];
                            else
                                state.tableData[i][j] = ["", -1];
                        } else
                            state.tableData[i][j] = ["", -1];
                    }
                }
            }
        },
    },
    extraReducers: {}
});

export const {
    updateToToday,
    updateCurrentEvent,
    updateIsAddEvent,
    updateTableData,
    handlePrevDayButtonClick,
    handleNextDayButtonClick,
    setSelectedDay,
    getDaysInMonth,
    getDayOfWeek,
    getAllYearData,
    isLeapYear,
    getCurrentWeekDays,
    handlePrevMonthButtonClick,
    handleNextMonthButtonClick,
    handleSelectChangeMonth,
    handleSelectChangeYear,
    handlePrevYearButtonClick,
    handleNextYearButtonClick,
    addEvent,
    deleteEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;