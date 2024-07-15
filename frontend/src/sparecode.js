{appUserData ? (
  <table>
    <tbody>
      <tr>
        <td>{appUserData.username}</td>
        <td>{appUserData.name}</td>
        <td>{appUserData.email}</td>
      </tr>
    </tbody>
  </table>
) : (
  <p>Loading...</p>
)}

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.isLogged) {
    navigate('/signup');
  } else {
    setAppUserData(user);
  }
}, [navigate]);


const [appUserData, setAppUserData] = useState(null);
