import React from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

const MonthPicker = ({handleChangeMonth, displayDate}) => {
    return (
        <DatePicker
            selected={displayDate}
            onChange={handleChangeMonth}
            dateFormat="MM/yyyy"
            showMonthYearPicker
        />
    )
}
export default MonthPicker;
