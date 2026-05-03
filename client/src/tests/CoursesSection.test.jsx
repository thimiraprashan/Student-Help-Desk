import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import CoursesSection from '../components/student/CoursesSection';
import { AppContext } from '../context/AppContext';

const mockContextValue = {
    allCourses: [
        { _id: '1', courseTitle: 'React Course', educatorName: 'Jane', courseThumbnail: '', calculateRating: 4, courseRatings: [], coursePrice: 10, discount: 0 },
        { _id: '2', courseTitle: 'Node Course', educatorName: 'John', courseThumbnail: '', calculateRating: 5, courseRatings: [], coursePrice: 20, discount: 0 },
    ],
    currency: '$',
    calculateRating: vi.fn(() => 4.5),
};

describe('CoursesSection Component', () => {
    it('displays a list of courses from context', () => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <BrowserRouter>
                    <CoursesSection />
                </BrowserRouter>
            </AppContext.Provider>
        );

        expect(screen.getByText('Learn from the best')).toBeInTheDocument();
        expect(screen.getByText('React Course')).toBeInTheDocument();
        expect(screen.getByText('Node Course')).toBeInTheDocument();
    });
});
