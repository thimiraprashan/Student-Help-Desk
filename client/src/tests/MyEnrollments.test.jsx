import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import MyEnrollments from '../pages/student/MyEnrollments';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

vi.mock('axios');

const mockContextValue = {
    userData: { _id: 'user1' },
    enrolledCourses: [
        { _id: 'c1', courseTitle: 'Enrolled Course 1', courseThumbnail: '', courseContent: [] },
    ],
    fetchUserEnrolledCourses: vi.fn(),
    getToken: vi.fn(() => 'mock-token'),
    backendUrl: 'http://localhost:5000',
    calculateCourseDuration: vi.fn(() => '2 hours'),
    calculateNoOfLectures: vi.fn(() => 5),
};

describe('MyEnrollments Page', () => {
    it('shows enrolled courses for the student', async () => {
        axios.post.mockResolvedValue({ data: { success: true, progressData: { lectureCompleted: [] }, purchaseData: { createdAt: new Date() } } });

        render(
            <AppContext.Provider value={mockContextValue}>
                <BrowserRouter>
                    <MyEnrollments />
                </BrowserRouter>
            </AppContext.Provider>
        );

        expect(screen.getByText('My Enrollments')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText('Enrolled Course 1')).toBeInTheDocument();
        });
    });
});
