import React, { useState } from 'react';
import "./Timesheet.css";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Timesheet() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(monday.getDate() - (today.getDay() + 6) % 7);
    const sunday = new Date(today);
    sunday.setDate(monday.getDate() + 6);

    const [startDate, setStartDate] = useState(monday);
    const [endDate, setEndDate] = useState(sunday); 
    const [showExtension, setShowExtension] = useState(false);
    const [hoursData, setHoursData] = useState({
        bauActivity: [, , , , , , ],
        salesActivity: [, , , , , , ],
    });

    const [submitSuccess, setSubmitSuccess] = useState(false);

    const user =  JSON.parse(localStorage.getItem('user'));
    const saveTimesheet = async () => {
        try {
            const timesheetData = {
                startDate: startDate,
                endDate: endDate,
                userEmail : user.email,
                userName : "",
                activities: [
                    {
                        name: 'BAU Activity',
                        hours: hoursData.bauActivity,
                        comment: document.getElementById('bauComment').value // Get BAU Activity comment
                    },
                    {
                        name: 'Sales Activity',
                        hours: hoursData.salesActivity,
                        comment: document.getElementById('salesComment').value // Get Sales Activity comment
                    }
                ],
                totalHoursPerDay: calculateTotalHoursPerDay(),
                totalHours: calculateGrandTotalHours()
            };
            const response = await axios.post('http://localhost:5000/timesheet-data', timesheetData);
            console.log(response.data); // Log the response from the server
            setHoursData({
                bauActivity: [, , , , , , ],
                salesActivity: [, , , , , , ],
            });
            document.getElementById('bauComment').value = '';
            document.getElementById('salesComment').value = '';
    
            setSubmitSuccess(true);
            // Optionally, you can show a success message to the user
        } catch (error) {
            console.error('Error saving timesheet:', error.message);
            // Optionally, you can show an error message to the user
        }
    };

    const handleHourChange = (activity, dayIndex, e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && parseInt(value) <= 10 || value === '') {
            const newHoursData = { ...hoursData };
            newHoursData[activity][dayIndex] = value;
            setHoursData(newHoursData);
        }
    };
    

    const calculateTotalHoursPerDay = () => {
        return [...Array(7)].map((_, index) => {
            const bauHours = parseInt(hoursData.bauActivity[index]) || 0;
            const salesHours = parseInt(hoursData.salesActivity[index]) || 0;
            return bauHours + salesHours;
        });
    };

    const calculateTotalHours = (activity) => {
        const total = hoursData[activity].reduce((acc, cur) => {
            const parsedValue = parseInt(cur);
            if (!isNaN(parsedValue)) {
                return acc + parsedValue;
            }
            return acc;
        }, 0);
        return isNaN(total) ? 0 : total;
    };

    const calculateGrandTotalHours = () => {
        const bauTotal = calculateTotalHours('bauActivity');
        const salesTotal = calculateTotalHours('salesActivity');
        return bauTotal + salesTotal;
    };


    const handlePreviousWeek = () => {
        const prevWeekStart = new Date(startDate);
        prevWeekStart.setDate(prevWeekStart.getDate() - 7);
        const prevWeekEnd = new Date(endDate);
        prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);
        setStartDate(prevWeekStart);
        setEndDate(prevWeekEnd);
        // Clear the entered data when changing the date
        setHoursData({
            bauActivity: [, , , , , , ],
            salesActivity: [, , , , , , ],
        });
        
        document.getElementById('bauComment').value = '';
        document.getElementById('salesComment').value = '';
    };
    
    // Function to handle clicking '>' to go to the next week
    const handleNextWeek = () => {
        const nextWeekStart = new Date(startDate);
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        const nextWeekEnd = new Date(endDate);
        nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
        setStartDate(nextWeekStart);
        setEndDate(nextWeekEnd);
        // Clear the entered data when changing the date
        setHoursData({
            bauActivity: [, , , , , , ],
            salesActivity: [, , , , , , ],
        });
        
        document.getElementById('bauComment').value = '';
        document.getElementById('salesComment').value = '';
    };
    
    // Function to handle clicking Allocation Extension button
    const handleExtensionClick = () => {
        setShowExtension(!showExtension);
    };

    return (
        <div className='body-content'>
            <h1>Timesheet</h1>

            {submitSuccess && (
                <div className="alert alert-success alert-dismissible" role="alert">
                    Timesheet submitted successfully!
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setSubmitSuccess(false)}></button>
                </div>
            )}
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
                            <td colSpan={2}><input type="text" id="bauComment" className="form-control" /></td> {/* Add ID for BAU Activity comment input */}
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
                            <td colSpan={2}><input type="text" id="salesComment" className="form-control" /></td> {/* Add ID for Sales Activity comment input */}
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
                <button className='btn2' onClick={saveTimesheet}>Submit <FontAwesomeIcon icon={faArrowRight} className='right-btn'/></button>
            </div>
        </div>
    )
}

export default Timesheet;

