// MovieDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieById } from '../services/apiService'; // Hàm API để lấy thông tin phim theo ID

const MovieDetail = () => {
  const { movieId } = useParams(); // Lấy movieId từ URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null);    // Trạng thái lỗi
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal
  const BASE_IMAGE_URL = 'http://localhost:8080/'; // URL cơ sở cho hình ảnh

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await fetchMovieById(movieId); // Lấy thông tin phim
        setMovie(data); // Lưu thông tin phim vào state
      } catch (err) {
        setError("Không thể tải chi tiết phim. Vui lòng thử lại sau."); // Thông báo lỗi nếu thất bại
      } finally {
        setLoading(false); // Thiết lập loading là false sau khi lấy dữ liệu
      }
    };

    loadMovie(); // Gọi hàm để lấy thông tin phim
  }, [movieId]);

  // Hiển thị trạng thái loading
  if (loading) {
    return <div>Đang tải chi tiết phim...</div>;
  }

  // Hiển thị trạng thái lỗi
  if (error) {
    return <div>{error}</div>;
  }

  // Hàm để mở modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Hàm để đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Hiển thị chi tiết phim
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Đường dẫn breadcrumb */}
      <div className="text-gray-600 text-sm mb-4">
        <a href="/" className="hover:text-black">Trang Chủ</a> {'>'} <span className="font-semibold">{movie.title}</span>
      </div>

      {/* Nội dung chính của phim */}
      <div className="flex">
        {/* Poster phim */}
        <div className="w-1/3">
          <img
            src={BASE_IMAGE_URL + movie.picture.replace(/\\/g, '/')}
            alt={movie.title}
            className="w-full h-auto mb-4 rounded-lg shadow-lg"
          />
        </div>

        {/* Thông tin phim */}
        <div className="w-2/3 ml-6">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          <div className="text-gray-800 mb-4">
            <p><strong>Thể loại:</strong> {movie.genre}</p>
            <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center space-x-4 mt-6">
            <button className="bg-red-600 text-white py-2 px-6 rounded-md font-bold hover:bg-red-700">
              Mua Vé
            </button>
            <button
              className="bg-green-500 text-white py-2 px-6 rounded-md font-bold hover:bg-green-700"
              onClick={openModal} // Mở modal khi nhấn nút Trailer
            >
              Trailer
            </button>
          </div>

          {/* Social buttons */}
          <div className="mt-4">
            <button className="bg-blue-600 text-white py-2 px-6 rounded-md font-bold hover:bg-blue-700">
              Like 96
            </button>
          </div>
        </div>
      </div>

      {/* Modal để hiển thị video trailer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 relative">
            {/* Nút đóng modal */}
            <button className="absolute top-2 right-2 text-gray-800 font-bold" onClick={closeModal}>
              X
            </button>
            
            {/* Iframe Trailer */}
            <div className="w-full h-full">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/44pt8w67S8I" // Nhúng URL video YouTube đã cung cấp
                title="GOJO VS SUKUNA FULL FIGHT AMV + ENDING SCENE 4K | LADY GAGA - JUDAS"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
