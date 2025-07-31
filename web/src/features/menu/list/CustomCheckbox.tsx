import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3, // Slightly increased
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    borderWidth: 1.5, // Slightly thicker border
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)', // Enhanced hover
      borderColor: 'rgba(255, 255, 255, 0.25)',
      transform: 'scale(1.05)', // Subtle scale effect
    },
    '&:checked': {
      backgroundColor: '#2EA67A', // Primary color
      borderColor: '#2EA67A', // Consistent border color
      '&:hover': {
        backgroundColor: '#267A5C', // Darker shade on hover
        borderColor: '#267A5C',
      },
    },
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '> svg > path': {
      fill: theme.white, // White checkmark
    },
  },
}));


const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
