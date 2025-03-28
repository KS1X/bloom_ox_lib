import { useNuiEvent } from '../../../hooks/useNuiEvent';
import {
  Box,
  createStyles,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 320,
    height: 580,
    pointerEvents: 'auto',
  },
  menuWrapper: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    backdropFilter: 'blur(12px)',
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.dark[4]}`,
    boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colors.dark[4]}`,
    backgroundColor: 'rgba(32, 32, 32, 0.75)',
    gap: 6,
  },
  titleContainer: {
    flex: '1 85%',
    padding: '4px 8px',
    borderRadius: theme.radius.sm,
  },
  titleText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
  },
  buttonsContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing.sm,
  },
  buttonsFlexWrapper: {
    gap: 6,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Box className={classes.menuWrapper}>
          <Flex className={classes.header}>
            {contextMenu.menu && (
              <HeaderButton
                icon="chevron-left"
                iconSize={16}
                handleClick={() => openMenu(contextMenu.menu)}
              />
            )}
            <Box className={classes.titleContainer}>
              <Text className={classes.titleText}>
                <ReactMarkdown components={MarkdownComponents}>
                  {contextMenu.title}
                </ReactMarkdown>
              </Text>
            </Box>
            <HeaderButton
              icon="xmark"
              canClose={contextMenu.canClose}
              iconSize={18}
              handleClick={closeContext}
            />
          </Flex>
          <Box className={classes.buttonsContainer}>
            <Stack className={classes.buttonsFlexWrapper}>
              {Object.entries(contextMenu.options).map((option, index) => (
                <ContextButton option={option} key={`context-item-${index}`} />
              ))}
            </Stack>
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;
