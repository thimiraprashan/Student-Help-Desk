import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import CoursesList from '../pages/student/CoursesList';
import { AppContext } from '../context/AppContext';

const mockContextValue = {
    allCourses: [
        { _id: '1', courseTitle: 'React Course', educatorName: 'Jane', courseThumbnail: '', courseRatings: [], coursePrice: 10, discount: 0 },
    ],
    currency: '$',
    calculateRating: vi.fn(() => 4.5),
};

describe('CoursesList Page', () => {
    it('renders and displays courses', () => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <BrowserRouter>
                    <CoursesList />
                </BrowserRouter>
            </AppContext.Provider>
        );

        expect(screen.getByRole('heading', { name: 'Course List' })).toBeInTheDocument();
        expect(screen.getByText('React Course')).toBeInTheDocument();
    });
});
