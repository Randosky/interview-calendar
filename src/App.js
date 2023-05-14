import "./App.css"
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {
    addEvent, deleteEvent,
    getAllYearData,
    getCurrentWeekDays,
    getDayOfWeek,
    getDaysInMonth,
    handleNextDayButtonClick,
    handleNextMonthButtonClick,
    handlePrevDayButtonClick,
    handlePrevMonthButtonClick,
    isLeapYear,
    setSelectedDay, updateCurrentEvent, updateIsAddEvent, updateTableData, updateToToday
} from "./store/calendarSlice";
import {BackMonths, Time, weekDayNames} from "./helpers/calendarHelper";
import {current} from "@reduxjs/toolkit";

function App() {
    const calendarSlice = useSelector(state => state.calendar)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(isLeapYear());
        dispatch(getDaysInMonth());
        dispatch(getDayOfWeek());
        dispatch(getAllYearData());
    }, [calendarSlice.month, calendarSlice.year])

    useEffect(() => {
        dispatch(getCurrentWeekDays());
        dispatch(updateTableData());
    }, [calendarSlice.month, calendarSlice.year, calendarSlice.day, calendarSlice.allEvents]);

    console.log(calendarSlice.allEvents)

    return (
        <div className="main">
            <div className="calendar">
                <div className="calendar__header">
                    <p className="header__title">Interview Calendar</p>
                    <div className="header__add"
                         onClick={() => dispatch(updateIsAddEvent())}>
                        <span className="add__span1"></span>
                        <span className="add__span2"></span>
                    </div>
                </div>
                <div className="calendar__containerHeader">
                    <table className="calendar__table">
                        <thead>
                        <tr>
                            <th></th>
                            {
                                weekDayNames.map((elem, index) => {
                                    return (
                                        <th className={"table__weekDayNames"} key={index}>{elem}</th>
                                    )
                                })
                            }
                        </tr>
                        <tr>
                            <th></th>
                            {
                                calendarSlice.currentWeekDays.map((day, ind) => {
                                    return (
                                        <th className={day === calendarSlice.day
                                            ? "table__weekDays weekDays__selected" : "table__weekDays"}
                                            key={ind}
                                            onClick={() => dispatch(setSelectedDay(day))}>
                                            {
                                                day !== undefined
                                                    ?
                                                    day
                                                    : " "
                                            }
                                            {
                                                day === calendarSlice.day
                                                    ?
                                                    <div className={"table__selected"}>
                                                        {day}
                                                    </div>
                                                    : ""
                                            }
                                        </th>
                                    )
                                })
                            }
                        </tr>
                        <tr>
                            <th className="table__headBorder"></th>
                            <th className="table__arrow table__headBorder"
                                onClick={() => dispatch(handlePrevDayButtonClick())}>&#10094;</th>
                            <th colSpan={5}
                                className="table__date table__headBorder">{BackMonths[calendarSlice.month] + " "
                                + calendarSlice.year}</th>
                            <th className="table__arrow table__headBorder"
                                onClick={() => dispatch(handleNextDayButtonClick())}>&#10095;</th>
                        </tr>
                        </thead>
                    </table>
                    <div className="calendar__containerBody">
                        <table className="calendar__table">
                            <tbody>
                            {
                                calendarSlice.tableData.map((row, rInd) => (
                                    <tr key={rInd}>
                                        {
                                            row.map((cell, cInd) => (
                                                <td className={cell[0].includes(":")
                                                    ? "table__tdTime" : rInd === 0
                                                        ? "table__firstRow" : cell[0] !== ""
                                                            ? "table__tdWithText" : "table__td"}
                                                    key={cInd} onClick={() => {
                                                    dispatch(deleteEvent(cell))
                                                }}>{cell[0]}</td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="bottom__today" onClick={() => dispatch(updateToToday())}>Today</p>
            </div>
            {
                calendarSlice.isAddEvent
                    ?
                    <div className="addEvent" onClick={() => dispatch(updateIsAddEvent())}>
                        <div className="addEvent__main" onClick={(e) => {
                            e.stopPropagation()
                        }}>
                            <p className="addEvent__title">Add new event</p>
                            <p className="addEvent__text">YYYY-MM-DD HH:mm</p>
                            <input type="datetime-local" className="addEvent__input"
                                   value={calendarSlice.currentEvent}
                                   onChange={(e) => {
                                       dispatch(updateCurrentEvent(e.target.value))
                                   }}/>
                            <div className="addEvent__buttons">
                                <button className="addEvent__button"
                                        onClick={() => dispatch(updateIsAddEvent())}>Cancel
                                </button>
                                <button className="addEvent__button"
                                        onClick={() => {
                                            dispatch(addEvent(calendarSlice.currentEvent))
                                            dispatch(updateIsAddEvent())
                                        }}
                                >Add
                                </button>
                            </div>
                        </div>
                    </div>
                    : ""

            }
        </div>
    );
}

export default App;
