import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import configureStore from 'redux-mock-store';
import Header from './index.tsx';
import '@testing-library/jest-dom';
import ShareModal from '../shareModal/index.tsx';

// mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// mock component share modal
jest.mock('../shareModal', () => jest.fn(() => <div data-testid="share-modal" />));

// mock redux
const mockStore = configureStore([]);

describe('Header Component', () => {
  let store;
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({
      pathname: '/',
      push: mockPush,
    });

    store = mockStore({
      user: {
        email: '',
      },
    });
  });

  test('renders correctly when user is not logged in', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('renders correctly when user is logged in', () => {
    store = mockStore({
      user: {
        email: 'test@example.com',
      },
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByTestId('welcome')).toBeInTheDocument();
    expect(screen.getByTestId('share-video')).toBeInTheDocument();
    expect(screen.getByTestId('logout')).toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    store = mockStore({
      user: {
        email: 'test@example.com',
      },
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('logout'));
    expect(mockPush).toHaveBeenCalledWith('/signIn');
  });

  test('opens ShareModal when Share Video is clicked', async () => {
    store = mockStore({
      user: {
        email: 'test@example.com',
      },
    });
    const openModalMock = jest.fn();

    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('share-video-button'));
    // Chờ modal xuất hiện trong DOM
    const modal = await screen.findByTestId('share-modal');
    expect(modal).toBeInTheDocument();

  });

  test('redirects to Home when logo is clicked', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    fireEvent.click(screen.getByText(/Share video/i));
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
