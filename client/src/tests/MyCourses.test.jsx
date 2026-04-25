import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import MyCourses from '../pages/educator/MyCourses';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

vi.mock('axios');

const mockContextValue = {
    backendUrl: 'http://localhost:5000',
    isEducator: true,
    currency: '$',
    getToken: vi.fn(() => 'mock-token'),
};

const mockCourses = [
    { _id: '1', courseTitle: 'Educator Course 1', courseThumbnail: '', enrolledStudents: [], coursePrice: 50, discount: 0, createdAt: new Date() },
];

describe('MyCourses Page', () => {
    it("shows educator's courses in a table", async () => {
        axios.get.mockResolvedValue({ data: { success: true, courses: mockCourses } });

        render(
            <AppContext.Provider value={mockContextValue}>
                <BrowserRouter>
                    <MyCourses />
                </BrowserRouter>
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Educator Course 1')).toBeInTheDocument();
        });
        expect(screen.getByText('My Courses')).toBeInTheDocument();
    });
});
