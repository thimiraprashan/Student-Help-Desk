import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams, useLocation } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';

const CoursesList = () => {

    const { input } = useParams()
    const { allCourses, navigate } = useContext(AppContext)
    const [filteredCourse, setFilteredCourse] = useState([])
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const selectedYear = queryParams.get('year') ? Number(queryParams.get('year')) : null
    const selectedSemester = queryParams.get('semester') ? Number(queryParams.get('semester')) : null

    const handleFilter = (year, semester) => {
        let path = '/course-list' + (input ? `/${input}` : '');
        let query = [];
        if (year) query.push(`year=${year}`);
        if (semester) query.push(`semester=${semester}`);
        
        if (query.length > 0) {
            navigate(`${path}?${query.join('&')}`);
        } else {
            navigate(path);
        }
    }

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            let tempCourses = allCourses.slice()

            if (input) {
                tempCourses = tempCourses.filter(item => item.courseTitle.toLowerCase().includes(input.toLowerCase()))
            }
            if (selectedYear) {
                tempCourses = tempCourses.filter(item => item.courseYear === selectedYear)
            }
            if (selectedSemester) {
                tempCourses = tempCourses.filter(item => item.courseSemester === selectedSemester)
            }

            setFilteredCourse(tempCourses)
        }

    }, [allCourses, input, selectedYear, selectedSemester])

    return (
        <>
            <div className="relative md:px-36 px-8 pt-20 text-left">
                <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                    <div>
                        <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
                        <p className='text-gray-500'><span onClick={() => navigate('/')} className='text-blue-600 cursor-pointer'>Home</span> / <span>Course List</span></p>
                    </div>
                    <SearchBar data={input} />
                </div>
                {input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600'>
                    <p>{input}</p>
                    <img onClick={() => navigate('/course-list' + location.search)} className='cursor-pointer' src={assets.cross_icon} alt="" />
                </div>}
                
                <div className="flex flex-col md:flex-row gap-8 mt-6 mb-16">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4 md:border-r border-gray-200 md:pr-4">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
                        <div 
                            className={`cursor-pointer mb-2 p-2 rounded ${!selectedYear && !selectedSemester ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleFilter(null, null)}
                        >
                            All Courses
                        </div>
                        {[1, 2, 3, 4].map(year => (
                            <div key={year} className="mb-2">
                                <div 
                                    className={`cursor-pointer p-2 rounded font-medium ${selectedYear === year && !selectedSemester ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => handleFilter(year, null)}
                                >
                                    Year {year}
                                </div>
                                {selectedYear === year && (
                                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-200 pl-2">
                                        {[1, 2].map(sem => (
                                            <div 
                                                key={sem}
                                                className={`cursor-pointer p-1.5 text-sm rounded ${selectedSemester === sem ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                                onClick={(e) => { e.stopPropagation(); handleFilter(year, sem); }}
                                            >
                                                Semester {sem}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Course Grid */}
                    <div className="flex-1 overflow-y-auto max-h-[70vh] px-1 pb-4">
                        {filteredCourse.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-2 md:p-0">
                                {filteredCourse.map((course, index) => <CourseCard key={index} course={course} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center border border-gray-200 border-dashed rounded-lg bg-gray-50 min-h-[300px]">
                                <h3 className="text-xl font-medium text-gray-500">No courses Avalible</h3>
                                <p className="text-gray-400 mt-2">Try clearing your filters or selecting a different Year/Semester.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CoursesList 