import React, { useEffect, useState } from 'react';
import { fetchMovies, fetchMovieById, createMovie, updateMovie, deleteMovie } from './../services/apiService';
import { Table, Button, Modal, Form, Input, message, Upload, Pagination, Image } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';


const { confirm } = Modal;

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const BASE_IMAGE_URL = 'http://localhost:8080/';

  // Fetch all movies
  const fetchAllMovies = async () => {
    setLoading(true);
    try {
      const moviesData = await fetchMovies();
      setMovies(moviesData.movies); // Assuming `fetchMovies` returns an object with `movies` key
    } catch (error) {
      message.error('Error fetching movies');
    } finally {
      setLoading(false);
    }
  };
  const getMovieImage = (picture) => {
    return picture ? BASE_IMAGE_URL + picture.replace(/\\/g, '/') : 'default-image.jpg';
};
  // Show confirmation modal for deleting a movie
  const showDeleteConfirm = (movieID) => {
    confirm({
      title: 'Are you sure you want to delete this movie?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteMovie(movieID);
      },
    });
  };

  // Delete movie
  const handleDeleteMovie = async (movieID) => {
    try {
      await deleteMovie(movieID);
      message.success('Movie deleted successfully');
      setMovies(movies.filter((movie) => movie.movie_id !== movieID));
    } catch (error) {
      message.error('Error deleting movie');
    }
  };

  // Open modal to add or edit a movie
  const openEditModal = async (movie) => {
    setEditingMovie(movie || null);
    if (movie) {
      const movieData = await fetchMovieById(movie.movie_id);
      form.setFieldsValue({
        title: movieData.title,
        genre: movieData.genre,
        duration: movieData.duration,
        picture: movieData.picture,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle movie submission
  const handleMovieSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('genre', values.genre);
    formData.append('duration', values.duration);
    if (values.picture) {
      formData.append('picture', values.picture.file);
    }

    try {
      if (editingMovie) {
        await updateMovie(editingMovie.movie_id, formData);
        message.success('Movie updated successfully');
      } else {
        await createMovie(formData);
        message.success('Movie created successfully');
      }
      fetchAllMovies();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error saving movie');
    }
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'movie_id',
      key: 'movie_id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Picture',
      dataIndex: 'picture',
      key: 'picture',
      render: (picture) => (
        <Image width={50} src={getMovieImage(picture)} alt="Movie Picture" />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, movie) => (
        <span>
          <Button type="primary" onClick={() => openEditModal(movie)} style={{ marginRight: 8 }}>
            Update
          </Button>
          <Button type="danger" onClick={() => showDeleteConfirm(movie.movie_id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý phim</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditModal(null)} style={{ marginBottom: 16 }}>
        Add Movie
      </Button>
      <Table
        columns={columns}
        dataSource={movies.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        rowKey="movie_id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={movies.length}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={[5, 10, 20, 50]}
        onShowSizeChange={handlePageChange}
      />

      {/* Movie Form Modal */}
      <Modal
        title={editingMovie ? 'Update Movie' : 'Add Movie'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleMovieSubmit}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Please input the genre!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Duration" name="duration" rules={[{ required: true, message: 'Please input the duration!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Picture" name="picture">
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Picture</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingMovie ? 'Save Changes' : 'Create Movie'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieManagement;
