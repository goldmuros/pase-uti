import type { Pase } from "@/types/Pase";
import {
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";

interface ListaPasesProps {
  pases: Pase[];
  expandedPase: string | false;
  onPaseChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const ListaPases: React.FC<ListaPasesProps> = ({
  expandedPase,
  onPaseChange,
  pases,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "primary.main", mb: 3 }}
        >
          <AssignmentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Pases Médicos
          <Badge badgeContent={pases.length} color="primary" sx={{ ml: 2 }}>
            <Box />
          </Badge>
        </Typography>

        {pases.length === 0 && (
          <Alert severity="info" sx={{ textAlign: "center" }}>
            No hay pases médicos registrados para este paciente
          </Alert>
        )}
        {pases.length > 0 &&
          pases.map((pase, index) => (
            <Accordion
              key={pase.id}
              expanded={expandedPase === pase.id}
              onChange={onPaseChange(pase.id)}
              sx={{
                mb: 1,
                "&:before": { display: "none" },
                boxShadow: 1,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: index === 0 ? "primary.50" : "grey.50",
                  "&:hover": {
                    backgroundColor: index === 0 ? "primary.100" : "grey.100",
                  },
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Principal: {pase.principal}
                      {index === 0 && (
                        <Chip
                          color="primary"
                          size="small"
                          sx={{ mb: 1, ml: 2 }}
                          label="Más reciente"
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actualmente: {pase.actualmente}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <List dense>
                    {[
                      { label: "Antecedentes", value: pase.antecedentes },
                      { label: "Pendientes", value: pase.pendientes },
                      { label: "GCS / RASS", value: pase.gcs_rass },
                      { label: "Antibióticos", value: pase.antibioticos },
                      { label: "VC/Cook", value: pase.vc_cook },
                    ].map((item, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {item.label}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 0.5,
                                p: 1,
                                backgroundColor: "grey.50",
                                borderRadius: 1,
                              }}
                            >
                              {item.value || "Sin información"}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
      </CardContent>
    </Card>
  );
};

export default ListaPases;
