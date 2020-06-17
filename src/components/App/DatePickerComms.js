import React from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComms = ({handleChangeDate, displayDate}) => {
    return (
        <DatePicker
            selected={displayDate}
            onChange={handleChangeDate}
        />
    )
}
export default DatePickerComms;
