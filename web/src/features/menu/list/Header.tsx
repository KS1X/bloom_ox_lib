import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    backdropFilter: 'blur(10px)',
    height: 60,
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.colors.dark[4]}`,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
  },
  heading: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: 0.5,
    color: theme.white,
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
