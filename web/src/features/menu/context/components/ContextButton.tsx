import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: params.disabled ? theme.colors.dark[3] : theme.white,
    whiteSpace: 'pre-wrap',
    fontSize: 14,
  },
  button: {
    height: 'fit-content',
    width: '100%',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: theme.radius.md,
    border: `1px solid transparent`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: params.readOnly
        ? 'rgba(151, 4, 4, 0.03)'
        : 'rgba(255, 255, 255, 0.06)',
      borderColor: params.readOnly ? 'transparent' : theme.colors.dark[4],
      cursor: params.readOnly ? 'default' : 'pointer',
    },
    '&:active': {
      transform: params.readOnly ? 'none' : 'scale(0.99)',
    },
  },
  iconImage: {
    maxWidth: '24px',
    borderRadius: 4,
  },
  description: {
    color: params.disabled ? theme.colors.dark[3] : theme.colors.dark[2],
    fontSize: 12,
    lineHeight: 1.4,
  },
  dropdown: {
    padding: 12,
    color: theme.white,
    fontSize: 14,
    maxWidth: 256,
    width: 'fit-content',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.colors.dark[4]}`,
    overflow: 'hidden',
  },
  buttonStack: {
    gap: 4,
    flex: 1,
  },
  buttonGroup: {
    gap: 6,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
    fontWeight: 500,
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    display: 'flex',
    flexShrink: 0,
  },
  scrollWrapper: {
    maxHeight: 250,
    overflowY: 'auto',
    paddingRight: 4,
    maskImage:'linear-gradient(to bottom, rgba(0,0,0,1) 96%, rgba(0,0,0,0.15) 98%, rgba(0,0,0,0) 100%)',
    WebkitMaskImage:'linear-gradient(to bottom, rgba(0,0,0,1) 96%, rgba(0,0,0,0.15) 98%, rgba(0,0,0,0) 100%)',
    maskSize: '100% 100%',
    maskRepeat: 'no-repeat',
  },
}));


const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
        withinPortal
        withArrow={false}
        transition="fade"
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="lg"
                            style={{ color: button.iconColor }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress value={button.progress} size="sm" color={button.colorScheme || 'dark.3'} />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <LibIcon icon="chevron-right" fixedWidth />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
        <div className={classes.scrollWrapper}>
          {button.image && <Image src={button.image} />}

          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata,
                index
              ) => (
                <div key={`context-metadata-${index}`}>
                  <Text>
                    {typeof metadata === 'string'
                      ? `${metadata}`
                      : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || 'dark.3'}
                    />
                  )}
                </div>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map(([label, value], index) => (
                  <Text key={`context-metadata-${index}`}>
                    {label}: {value}
                  </Text>
                ))}
            </>
          )}
        </div>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
