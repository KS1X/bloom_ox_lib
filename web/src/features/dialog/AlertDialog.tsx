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
    color: theme.colors.dark[0],
  },
  modal: {
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: theme.radius.lg,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
    border: `1.33px solid ${theme.colors.dark[4]}`,
  },
  button: {
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: 0.5,
    height: 36,
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
      overlayOpacity={0.44}
      overlayBlur={8}
      exitTransitionDuration={150}
      transition="fade"
      classNames={{ modal: classes.modal }}
      title={
        <ReactMarkdown components={MarkdownComponents}>
          {dialogData.header}
        </ReactMarkdown>
      }
    >
      <Stack className={classes.contentStack}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            ...MarkdownComponents,
            img: ({ ...props }) => (
              <img
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                {...props}
              />
            ),
          }}
        >
          {dialogData.content}
        </ReactMarkdown>
        <Group position="right" spacing={10}>
          {dialogData.cancel && (
            <Button
              variant="default"
              onClick={() => closeAlert('cancel')}
              className={classes.button}
            >
              {dialogData.labels?.cancel || locale.ui.cancel}
            </Button>
          )}
          <Button
            variant={dialogData.cancel ? 'light' : 'filled'}
            color={theme.primaryColor}
            onClick={() => closeAlert('confirm')}
            className={classes.button}
          >
            {dialogData.labels?.confirm || locale.ui.confirm}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AlertDialog;
