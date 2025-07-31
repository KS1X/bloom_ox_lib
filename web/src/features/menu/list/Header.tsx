import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Slightly more opaque
    height: 64, // Slightly larger
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.colors.dark[4]}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)', // Enhanced shadow
    backdropFilter: 'blur(4px)', // Subtle glass effect
  },
  heading: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 600, // Slightly bolder
    letterSpacing: 0.8, // Increased letter spacing
    color: theme.white,
    lineHeight: 1.2, // Better line height
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
