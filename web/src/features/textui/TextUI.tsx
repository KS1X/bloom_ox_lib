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
    padding: 20,
    zIndex: 100,
  },
  container: {
    fontSize: 16,
    fontWeight: 500,
    padding: '16px 20px',
    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(32, 32, 32, 0.92) 100%)',
    color: theme.white,
    fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    borderRadius: 12,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 4px 16px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    border: `1px solid rgba(46, 166, 122, 0.3)`,
    backdropFilter: 'blur(12px)',
    maxWidth: 420,
    minWidth: 200,
    wordBreak: 'break-word',
    lineHeight: 1.6,
    letterSpacing: '0.01em',
    pointerEvents: 'auto',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent 0%, #2EA67A 50%, transparent 100%)',
      borderRadius: '12px 12px 0 0',
    },
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    height: 40,
    borderRadius: 8,
    background: 'linear-gradient(135deg, rgba(46, 166, 122, 0.2) 0%, rgba(46, 166, 122, 0.1) 100%)',
    border: '1px solid rgba(46, 166, 122, 0.3)',
    boxShadow: '0 2px 8px rgba(46, 166, 122, 0.2)',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  textContent: {
    flex: 1,
    '& p': {
      margin: 0,
      '&:not(:last-child)': {
        marginBottom: 8,
      },
    },
    '& strong': {
      color: '#2EA67A',
      fontWeight: 600,
      textShadow: '0 0 8px rgba(46, 166, 122, 0.3)',
    },
    '& em': {
      color: 'rgba(255, 255, 255, 0.8)',
      fontStyle: 'italic',
    },
    '& code': {
      background: 'rgba(46, 166, 122, 0.15)',
      color: '#2EA67A',
      padding: '2px 6px',
      borderRadius: 4,
      fontSize: '0.9em',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      border: '1px solid rgba(46, 166, 122, 0.2)',
      fontWeight: 500,
    },
    '& kbd': {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      color: '#ffffff',
      padding: '4px 8px',
      borderRadius: 6,
      fontSize: '0.85em',
      fontWeight: 600,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'linear-gradient(135deg, rgba(46, 166, 122, 0.2) 0%, rgba(46, 166, 122, 0.1) 100%)',
        color: '#2EA67A',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
    },
    '& ul, & ol': {
      margin: '8px 0',
      paddingLeft: 20,
      '& li': {
        marginBottom: 4,
        '&::marker': {
          color: '#2EA67A',
        },
      },
    },
    '& blockquote': {
      borderLeft: '3px solid #2EA67A',
      paddingLeft: 12,
      margin: '8px 0',
      backgroundColor: 'rgba(46, 166, 122, 0.05)',
      borderRadius: '0 6px 6px 0',
      fontStyle: 'italic',
      '& p': {
        margin: 0,
      },
    },
    '& hr': {
      border: 'none',
      height: 1,
      background: 'linear-gradient(90deg, transparent 0%, rgba(46, 166, 122, 0.5) 50%, transparent 100%)',
      margin: '12px 0',
    },
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
            <Group spacing={16} align="center" noWrap>
              {data.icon && (
                <Box className={classes.iconContainer}>
                  <LibIcon
                    icon={data.icon}
                    fixedWidth
                    size="lg"
                    animation={data.iconAnimation}
                    style={{
                      color: data.iconColor || '#2EA67A',
                      fontSize: '18px',
                    }}
                  />
                </Box>
              )}
              <Box className={classes.textContent}>
                <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                  {data.text}
                </ReactMarkdown>
              </Box>
            </Group>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
