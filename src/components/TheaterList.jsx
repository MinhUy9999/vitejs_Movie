// components/TheaterList.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTheaters, fetchRoomsByTheaterID, fetchScreensByRoomID, fetchSchedulesByScreenID } from '../services/apiService';

const TheaterList = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [theaters, setTheaters] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [screens, setScreens] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [loadingTheaters, setLoadingTheaters] = useState(true);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [loadingScreens, setLoadingScreens] = useState(false);
    const [loadingSchedules, setLoadingSchedules] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTheaters = async () => {
            try {
                const data = await fetchTheaters(movieId);
                setTheaters(data.theaters || []); // Ensure theaters is an array
            } catch (err) {
                setError('Failed to fetch theaters.');
            } finally {
                setLoadingTheaters(false);
            }
        };
        loadTheaters();
    }, [movieId]);

    const handleTheaterClick = async (theaterID) => {
        setLoadingRooms(true);
        setSelectedTheater(theaterID);
        setRooms([]);
        setScreens([]);
        setSchedules([]);
        try {
            const data = await fetchRoomsByTheaterID(theaterID);
            setRooms(data || []); // Ensure rooms is an array
        } catch (err) {
            setError('Failed to fetch rooms.');
        } finally {
            setLoadingRooms(false);
        }
    };

    const handleRoomClick = async (roomID) => {
        setLoadingScreens(true);
        setSelectedRoom(roomID);
        setScreens([]);
        setSchedules([]);
        try {
            const data = await fetchScreensByRoomID(roomID);
            setScreens(data.screens || []); // Ensure screens is an array
        } catch (err) {
            setError('Failed to fetch screens.');
        } finally {
            setLoadingScreens(false);
        }
    };

    const handleScreenClick = async (screenID) => {
        setLoadingSchedules(true);
        setSelectedScreen(screenID);
        setSchedules([]);
        try {
            const data = await fetchSchedulesByScreenID(screenID);
            setSchedules(data || []); // Ensure schedules is an array
        } catch (err) {
            setError('Failed to fetch schedules.');
        } finally {
            setLoadingSchedules(false);
        }
    };

    const handleScheduleClick = (scheduleID) => {
        navigate(`/seats/${selectedScreen}/${scheduleID}`);
    };

    if (loadingTheaters) {
        return <div>Đang tải danh sách rạp...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-6">DANH SÁCH RẠP</h2>

            <div className="space-y-4">
                {(theaters || []).map((theater) => (
                    <div
                        key={theater.theater_id}
                        className="bg-purple-700 rounded-lg p-4 text-white"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-yellow-300">
                                    {theater.name}
                                </h3>
                                <p>{theater.location}</p>
                            </div>
                            <button
                                onClick={() => handleTheaterClick(theater.theater_id)}
                                className="text-white text-2xl font-bold"
                            >
                                {selectedTheater === theater.theater_id ? "▲" : "▼"}
                            </button>
                        </div>

                        {selectedTheater === theater.theater_id && (
                            <div className="mt-4">
                                <div className="mb-2 text-lg font-semibold">Phòng chiếu</div>
                                <div className="flex space-x-2">
                                    {(rooms || []).map((room) => (
                                        <button
                                            key={room.room_id}
                                            onClick={() => handleRoomClick(room.room_id)}
                                            className="bg-purple-900 px-3 py-1 rounded-lg"
                                        >
                                            {room.room_number}
                                        </button>
                                    ))}
                                </div>

                                {selectedRoom && (
                                    <>
                                        <div className="mt-4 mb-2 text-lg font-semibold">
                                            Màn hình chiếu
                                        </div>
                                        <div className="flex space-x-2">
                                            {(screens || []).map((screen) => (
                                                <button
                                                    key={screen.screen_id}
                                                    onClick={() => handleScreenClick(screen.screen_id)}
                                                    className="bg-purple-900 px-3 py-1 rounded-lg"
                                                >
                                                    Màn hình {screen.screen_number}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {selectedScreen && (schedules || []).length > 0 && (
                                    <>
                                        <div className="mt-4 mb-2 text-lg font-semibold">
                                            Lịch chiếu
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {(schedules || []).map((schedule) => (
                                                <button
                                                    key={schedule.scheduleID}
                                                    onClick={() => handleScheduleClick(schedule.scheduleID)}
                                                    className="bg-white text-purple-900 px-2 py-1 rounded-lg"
                                                >
                                                    {schedule.showTime}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TheaterList;
