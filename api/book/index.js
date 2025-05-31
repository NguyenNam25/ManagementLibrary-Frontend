import axiosClient from "../axiosClient";

const bookApi = {
  getAllBooks: async () => {
    try {
      const response = await axiosClient.get("/books");
      return response;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },
  getBookById: async (id) => {
    try {
      const response = await axiosClient.get(`/books/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching book with id ${id}:`, error);
      throw error;
    }
  },
  createBook: async (book) => {
    try {
      console.log(book);
      const response = await axiosClient.post("/books", book, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  },
  updateBook: async (id, book) => {
    try {
      const response = await axiosClient.put(`/books/${id}`, book, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error(`Error updating book with id ${id}:`, error);
      throw error;
    }
  },
  deleteBook: async (id) => {
    try {
      const response = await axiosClient.delete(`/books/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting book with id ${id}:`, error);
      throw error;
    }
  },
  getLatestBooks: async () => {
    try {
      const response = await axiosClient.get("/books/latest");
      return response;
    } catch (error) {
      console.error("Error fetching latest books:", error);
      throw error;  
    }
  },
  
  getPopularBooks: async () => {
    try {
      const response = await axiosClient.get("/books/popular");
      return response;
    } catch (error) {
      console.error("Error fetching popular books:", error);
      throw error;
    }
  },
};

export default bookApi;
