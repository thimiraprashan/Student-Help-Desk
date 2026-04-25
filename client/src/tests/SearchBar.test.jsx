import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import SearchBar from '../components/student/SearchBar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ search: '' }),
    };
});

describe('SearchBar Component', () => {
    it('accepts user input and triggers navigation on search', () => {
        render(
            <BrowserRouter>
                <SearchBar />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Search for courses');
        fireEvent.change(input, { target: { value: 'React' } });
        expect(input.value).toBe('React');

        const button = screen.getByRole('button', { name: /search/i });
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/course-list/React');
    });
});
