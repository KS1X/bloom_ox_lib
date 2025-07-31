import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: theme.radius.md, // More rounded
    flex: '1 15%',
    alignSelf: 'stretch',
    padding: '8px 4px', // Increased padding
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slightly more opaque
    transition: 'all 0.2s ease', // Enhanced transition
    border: '1px solid transparent', // Add border for effect
    '&:hover': {
      backgroundColor: params.canClose === false 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(220, 53, 69, 0.8)', // Better red hover for close
      borderColor: params.canClose === false 
        ? 'transparent' 
        : 'rgba(220, 53, 69, 0.9)',
      transform: params.canClose === false ? 'none' : 'translateY(-1px)', // Lift effect
      boxShadow: params.canClose === false 
        ? 'none' 
        : '0 4px 12px rgba(220, 53, 69, 0.3)', // Red shadow
    },
    '&:disabled': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)', // More subtle disabled state
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  root: {
    border: 'none',
    height: '100%',
    backgroundColor: 'transparent',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: params.canClose === false ? theme.colors.dark[3] : theme.white,
    transition: 'color 0.2s ease',
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="subtle"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;
