import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems:
      params.position === 'top-center' ? 'flex-start' :
      params.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent:
      params.position === 'right-center' ? 'flex-end' :
      params.position === 'left-center' ? 'flex-start' : 'center',
    pointerEvents: 'none',
    padding: 14,
  },
  container: {
    fontSize: 15,
    padding: '12px 16px',
    backgroundColor: 'rgba(32, 32, 32, 0.75)',
    color: theme.white,
    fontFamily: 'Roboto, sans-serif',
    borderRadius: theme.radius.lg,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
    backdropFilter: 'blur(8px)',
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    maxWidth: 400,
    wordBreak: 'break-word',
    lineHeight: 1.5,
    pointerEvents: 'auto',
  },
}));


const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center'; // Default right position
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.container}>
            <Group spacing={12}>
              {data.icon && (
                <LibIcon
                  icon={data.icon}
                  fixedWidth
                  size="lg"
                  animation={data.iconAnimation}
                  style={{
                    color: data.iconColor,
                    alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                  }}
                />
              )}
              <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                {data.text}
              </ReactMarkdown>
            </Group>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
