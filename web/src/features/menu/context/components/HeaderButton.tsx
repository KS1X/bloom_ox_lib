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
    borderRadius: theme.radius.sm,
    flex: '1 15%',
    alignSelf: 'stretch',
    padding: '6px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      cursor: 'not-allowed',
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
