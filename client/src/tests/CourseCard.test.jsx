import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import CourseCard from '../components/student/CourseCard';
import { AppContext } from '../context/AppContext';

// Mock AppContext
const mockContextValue = {
    currency: '$',
    calculateRating: vi.fn((course) => 4.5),
};

const mockCourse = {
    _id: '1',
    courseTitle: 'Introduction to React',
    courseThumbnail: 'react.png',
    educatorName: 'Jane Doe',
    courseRatings: [5, 4],
    coursePrice: 100,
    discount: 10,
};

describe('CourseCard Component', () => {
    it('renders with course title, description (educator name), and rating', () => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <BrowserRouter>
                    <CourseCard course={mockCourse} />
                </BrowserRouter>
            </AppContext.Provider>
        );

        expect(screen.getByText('Introduction to React')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('(2)')).toBeInTheDocument();
        expect(screen.getByText('$90.00')).toBeInTheDocument();
    });
});
