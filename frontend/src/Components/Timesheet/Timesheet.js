import React, { useState } from 'react';
import "./Timesheet.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Timesheet() {
    const [startDate, setStartDate] = useState(new Date('2024-01-28')); // Initial start date
    const [endDate, setEndDate] = useState(new Date('2024-02-03')); // Initial end date
    const [showExtension, setShowExtension] = useState(false); // State to control the visibility of Allocation Extension section

    // Dummy data for hours, replace with actual data and handle functions
    const [hoursData, setHoursData] = useState({
        bauActivity: [, , , , , , ],
        salesActivity: [, , , , , , ],
    });

    // Function to handle hour change for a specific activity on a specific day
    const handleHourChange = (activity, dayIndex, e) => {
        const value = e.target.value;
        // Validate input to allow only numeric characters or an empty string
        if (/^\d*$/.test(value) && parseInt(value) <= 10 || value === '') {
            const newHoursData = { ...hoursData };
            newHoursData[activity][dayIndex] = value;
            setHoursData(newHoursData);
        }
    };

    // Function to calculate total hours for each day of the week
    const calculateTotalHoursPerDay = () => {
        return [...Array(7)].map((_, index) => {
            const bauHours = parseInt(hoursData.bauActivity[index]) || 0;
            const salesHours = parseInt(hoursData.salesActivity[index]) || 0;
            return bauHours + salesHours;
        });
    };
    // Function to calculate total hours for a specific activity
    const calculateTotalHours = (activity) => {
        const total = hoursData[activity].reduce((acc, cur) => {
            const parsedValue = parseInt(cur);
            if (!isNaN(parsedValue)) {
                return acc + parsedValue;
            }
            return acc;
        }, 0);

        return isNaN(total) ? '' : total;
    };

    // Function to calculate grand total hours for the week
    const calculateGrandTotalHours = () => {
        const bauTotal = calculateTotalHours('bauActivity');
        const salesTotal = calculateTotalHours('salesActivity');
        const grandTotal = bauTotal + salesTotal;
        return isNaN(grandTotal) ? '' : grandTotal;
    };


    // Function to handle clicking '<' to go to the previous week
    const handlePreviousWeek = () => {
        const prevWeekStart = new Date(startDate);
        prevWeekStart.setDate(prevWeekStart.getDate() - 7);
        const prevWeekEnd = new Date(endDate);
        prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);
        setStartDate(prevWeekStart);
        setEndDate(prevWeekEnd);
    };

    // Function to handle clicking '>' to go to the next week
    const handleNextWeek = () => {
        const nextWeekStart = new Date(startDate);
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        const nextWeekEnd = new Date(endDate);
        nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
        setStartDate(nextWeekStart);
        setEndDate(nextWeekEnd);
    };

    // Function to handle clicking Allocation Extension button
    const handleExtensionClick = () => {
        setShowExtension(!showExtension);
    };

    return (
        <div className='body-content'>
            <h1>Timesheet</h1>
            <div className='time1'>
                <p className='hours'>Total Hours : {calculateGrandTotalHours()}</p>
                <p>
                    <button className='btn btn-secondary' onClick={handlePreviousWeek}>{'<'}</button>
                    {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()} `}
                    <button className='btn btn-secondary' onClick={handleNextWeek}>{'>'}</button>
                </p>
            </div>
            <div className='select-content'>
                <p>Allocation Extension</p>
                <button className='btn btn-primary' onClick={handleExtensionClick}>{'⇵'}</button>
            </div>
            {showExtension && <div className='extension-content'>
                {/* Your content for Allocation Extension goes here */}
                <p>This is the Allocation Extension section</p>
            </div>}
            <div className='sheet-content'>
                <p>Timesheet</p>
            </div>
            <div className="table-content">
                <table className="table">
                    <thead className="table-head">
                        <tr>
                            <th colSpan={2} className='col-double'>Project Type</th>
                            <th colSpan={2} className='col-double'>Project Name</th>
                            <th colSpan={2} className='col-double'>Task</th>
                            <th colSpan={2} className='col-double'>Comment</th>
                            <th className='weeks'>Mon</th>
                            <th className='weeks'>Tue</th>
                            <th className='weeks'>Wed</th>
                            <th className='weeks'>Thu</th>
                            <th className='weeks'>Fri</th>
                            <th className='weeks'>Sat</th>
                            <th className='weeks'>Sun</th>
                            <th>Total</th>
                            <th className="thlast"><input /></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={2}>BAU Activity</td>
                            <td colSpan={2}>
                                <select className="form-control">
                                    <option value="Project" selected>Project</option>
                                    <option value="Activity">Activity</option>
                                </select>
                            </td>
                            <td colSpan={2}>
                                <select className="form-control">
                                    <option value="Task" selected>Task</option>
                                    <option value="task2">Task2</option>
                                </select>
                            </td>
                            <td colSpan={2}><input type="text" className="form-control" /></td>
                            {[...Array(7)].map((_, index) => (
                                <td key={index} className="td2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        min="0"
                                        max="10"
                                        maxLength="2"
                                        value={hoursData.bauActivity[index] || ''}
                                        onChange={(e) => handleHourChange('bauActivity', index, e)}
                                    />
                                </td>
                            ))}

                            <td style={{ color: calculateTotalHours('bauActivity') > 10 ? 'red' : 'black' }}>
                                {calculateTotalHours('bauActivity')}
                            </td>
                            <td className="td2"><input type="text" className="form-control" /></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Sales Activity</td>
                            <td colSpan={2}>
                                <select className="form-control">
                                    <option value="Project" selected>Project</option>
                                    <option value="Activity">Activity</option>
                                </select>
                            </td>
                            <td colSpan={2}>
                                <select className="form-control">
                                    <option value="Task" selected>Task</option>
                                    <option value="task2">Task2</option>
                                </select>
                            </td>
                            <td colSpan={2}><input type="text" className="form-control" /></td>
                            {[...Array(7)].map((_, index) => (
                                <td key={index} className="td2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        min="0"
                                        max="10"
                                        maxLength="2"
                                        value={hoursData.salesActivity[index] || ''}
                                        onChange={(e) => handleHourChange('salesActivity', index, e)}
                                    />
                                </td>
                            ))}

                            <td style={{ color: calculateTotalHours('salesActivity') > 10 ? 'red' : 'black' }}>
                                {calculateTotalHours('salesActivity')}
                            </td>

                            <td className="td2"><input type="text" className="form-control" /></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Totals Hours</td>
                            <td colSpan={2}></td>
                            <td colSpan={2}></td>
                            <td colSpan={2}></td>
                            {calculateTotalHoursPerDay().map((hours, index) => (
                                <td key={index} style={{ color: hours > 10 ? 'red' : 'black' }}>
                                    {isNaN(hours) ? '' : hours}
                                </td>
                            ))}

                            <td style={{ color: calculateGrandTotalHours() > 10 ? 'red' : 'black' }}>
                                {calculateGrandTotalHours()}
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Machine Hours</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Break Hours</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='end'>
                <button className='btn1'>Save</button>
                <button className='btn2'>Submit <FontAwesomeIcon icon={faArrowRight} className='right-btn'/></button>
            </div>
        </div>
    )
}

export default Timesheet;
