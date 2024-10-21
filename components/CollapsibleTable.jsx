import React, { useEffect, useState } from "react";
import { Box, Button, Collapse, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Divider, CircularProgress } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = "http://localhost:3000/equipos";

export default function CollapsibleTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const startTime = performance.now(); // Inicio del tiempo
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        console.log("Datos recibidos:", json); // Loguear los datos recibidos
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        const endTime = performance.now(); // Fin del tiempo
        console.log(`Tiempo de respuesta: ${(endTime - startTime).toFixed(2)} ms`); // Loguear el tiempo de respuesta
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table>
        <TableBody>
          {data.map((row) => (
            <React.Fragment key={row.estacion}>
              <TableRow>
                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: row.ping ? 'green' : 'red',
                      marginRight: 1
                    }}
                  />
                  {row.estacion}
                </TableCell>
                <TableCell>
                  <Button 
                    onClick={() => handleToggle(row.estacion)} 
                    sx={{
                      transition: 'transform 0.3s ease',
                      transform: open[row.estacion] ? 'rotate(180deg)' : 'rotate(0deg)',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    <ExpandMoreIcon />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <Collapse in={open[row.estacion]} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      {row.equipos.map((equipo, index) => (
                        <Paper key={index} sx={{ margin: 1, padding: 1, width: '90%', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: equipo.ping ? 'green' : 'red',
                              marginRight: 1
                            }}
                          />
                          <span>{equipo.nombre} - {equipo.ip}</span>
                        </Paper>
                      ))}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
              <Divider sx={{ marginY: 2 }} />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
