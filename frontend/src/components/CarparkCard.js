import React, { useState } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PlaceIcon from "@mui/icons-material/Place";

const CarparkCard = ({ carpark, onSelect }) => {
  const [showFullPrice, setShowFullPrice] = useState(false);

  const formatPrice = (priceString) => {
    if (!priceString) return { short: "", full: "" };
    const firstSpaceIndex = priceString.indexOf(" ");
    if (firstSpaceIndex === -1)
      return { short: priceString, full: priceString };

    return {
      short: priceString.substring(0, firstSpaceIndex),
      full: priceString,
    };
  };

  const { short: shortPrice, full: fullPrice } = formatPrice(carpark.price);

  return (
    <Card
      style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}
      sx={{
        borderRadius: 3,
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
          transition: "all 0.2s ease-in-out",
        },
      }}
      onClick={() => onSelect(carpark)}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {carpark.address || carpark.location}
          </Typography>
          <IconButton size="small" color="primary">
            <PlaceIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            {Math.round(carpark.dist)}m away
          </Typography>
          {/* First case: When all lot information exists */}
          {carpark.lot_type &&
            carpark.lots_available != null &&
            carpark.total_lots != null && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DirectionsCarIcon fontSize="small" />
                <Typography variant="body2">
                  {carpark.lots_available}/{carpark.total_lots} lots
                </Typography>
              </Box>
            )}

          {/* Second case: When only lots_available exists */}
          {carpark.lot_type &&
            carpark.lots_available != null &&
            !carpark.total_lots && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DirectionsCarIcon fontSize="small" />
                <Typography variant="body2">
                  {carpark.lots_available} lots
                </Typography>
              </Box>
            )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // Changed to column for vertical stacking
            alignItems: "flex-start",
            mt: 1,
            gap: 0.5, // Reduced gap for vertical spacing
          }}
        >
          {carpark.price ? (
            <>
              {fullPrice === shortPrice ? (
                // If no whitespace, show full price
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    textAlign: "left",
                  }}
                >
                  {fullPrice}
                </Typography>
              ) : (
                // If has whitespace, show either button or full price + hide button
                <>
                  {showFullPrice ? (
                    <>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                          textAlign: "left",
                        }}
                      >
                        {fullPrice}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullPrice(!showFullPrice);
                        }}
                      >
                        Hide price
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullPrice(!showFullPrice);
                      }}
                    >
                      Show price
                    </Typography>
                  )}
                </>
              )}
            </>
          ) : !carpark.lot_type && !carpark.price ? (
            <Typography variant="body2" color="text.secondary">
              No information available
            </Typography>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CarparkCard;
