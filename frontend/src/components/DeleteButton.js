import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
const DeleteButton = ({ id }) => {
    const deleteUrl = `http://localhost:8080/v1/item/${id}`;
    const navigate = useNavigate();
  
    const handleDelete = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      try {
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          },
        });
  
        if (response.ok) {
          // Jika penghapusan berhasil, panggil fungsi onDelete yang diberikan sebagai prop
          window.location.reload();
          alert("Data Berhasil Dihapus")
        } else {
          if (response.status === 401) {
            // Unauthorized, token tidak valid
            navigate('/', { state: { error: 'Timeout Access. Please log in' } });
          }
          console.error('Gagal menghapus data:', response.status);
        }
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
      }
    };
  
    return (
      <Button className='ml-3' variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    );
  };

  export default DeleteButton;