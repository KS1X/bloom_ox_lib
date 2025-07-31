import {
  Button,
  createStyles,
  Group,
  Modal,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme) => ({
  contentStack: {
    color: theme.colors.dark[1], // Improved readability
    gap: theme.spacing.md,
  },
  modal: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)', // Consistent with other components
    borderRadius: theme.radius.lg,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.45)', // Enhanced shadow for better depth
    border: `1px solid ${theme.colors.dark[4]}`, // Consistent border width
    backdropFilter: 'blur(8px)', // Modern glass effect
  },
  title: {
    color: theme.white,
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    '& h1, & h2, & h3': {
      color: theme.white,
      margin: 0,
      fontSize: 18,
      fontWeight: 600,
    },
  },
  content: {
    color: theme.colors.dark[1],
    lineHeight: 1.6,
    fontSize: 14,
    '& p': {
      margin: `${theme.spacing.xs}px 0`,
      lineHeight: 1.6,
    },
    '& img': {
      maxWidth: '100%',
      maxHeight: '300px',
      borderRadius: theme.radius.md,
      marginTop: theme.spacing.sm,
    },
  },
  buttonGroup: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  button: {
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: 0.5,
    height: 40, // Slightly larger for better touch targets
    borderRadius: theme.radius.md,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${theme.colors.dark[4]}`,
    color: theme.colors.dark[1],
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: theme.colors.dark[3],
      color: theme.white,
    },
  },
  confirmButton: {
    backgroundColor: '#2EA67A', // Updated primary color
    border: 'none',
    color: theme.white,
    '&:hover': {
      backgroundColor: '#267A5C', // Darker shade for hover
    },
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <Modal
      opened={opened}
      centered={dialogData.centered}
      size={dialogData.size || 'md'}
      overflow={dialogData.overflow ? 'inside' : 'outside'}
      closeOnClickOutside={false}
      onClose={() => closeAlert('cancel')}
      withCloseButton={false}
      overlayOpacity={0.5} // Slightly increased for better focus
      overlayBlur={12} // Enhanced blur for modern feel
      exitTransitionDuration={200}
      transition="fade"
      classNames={{ modal: classes.modal }}
      title={
        <div className={classes.title}>
          <ReactMarkdown components={MarkdownComponents}>
            {dialogData.header}
          </ReactMarkdown>
        </div>
      }
    >
      <Stack className={classes.contentStack}>
        <div className={classes.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => (
                <img
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                  {...props}
                />
              ),
            }}
          >
            {dialogData.content}
          </ReactMarkdown>
        </div>
        <Group position="right" spacing={12} className={classes.buttonGroup}>
          {dialogData.cancel && (
            <Button
              variant="default"
              onClick={() => closeAlert('cancel')}
              className={`${classes.button} ${classes.cancelButton}`}
            >
              {dialogData.labels?.cancel || locale.ui.cancel}
            </Button>
          )}
          <Button
            onClick={() => closeAlert('confirm')}
            className={`${classes.button} ${classes.confirmButton}`}
          >
            {dialogData.labels?.confirm || locale.ui.confirm}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AlertDialog;
