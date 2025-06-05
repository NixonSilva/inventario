const handleLogin = async (event) => {
  event.preventDefault();
  setResponseMessage("");
  setloginButton(false);
  try {
    const response = await fetch(`${config.apiUrlInterno}/login-navemar-interno.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: nit, password: password }),
    });

    const data = await response.json();

    if (data.status === "success") {
      loginInterno(
        {
          nit,
          nombreCliente: data.nombre,
          perfil: data.perfil,
          // puedes agregar más campos si tu API los retorna
        },
        data.authToken,
        "2025-12-31T23:59:59Z" // puedes calcularlo si tu backend lo envía
      );
      navigate("/panel-navemar");
      setNit("");
      setPassword("");
    } else {
      setResponseMessage("Credenciales inválidas");
      setloginButton(true);
    }
  } catch (error) {
    setResponseMessage("Error en la conexión: " + error.message);
    setloginButton(true);
  }
};
