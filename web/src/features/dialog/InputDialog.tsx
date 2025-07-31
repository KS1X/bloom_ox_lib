import {
  Button,
  createStyles,
  Group,
  Modal,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles((theme) => ({
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
  },
  contentStack: {
    gap: theme.spacing.md,
  },
  formContainer: {
    gap: theme.spacing.sm,
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
    '&:disabled': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderColor: theme.colors.dark[5],
      color: theme.colors.dark[4],
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  confirmButton: {
    backgroundColor: '#2EA67A', // Project primary color
    border: 'none',
    color: theme.white,
    '&:hover': {
      backgroundColor: '#267A5C', // Darker shade for hover
    },
  },
}));

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(index, {
        value:
          row.type !== 'checkbox'
            ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
              ? row.default === true
                ? new Date().getTime()
                : Array.isArray(row.default)
                ? row.default.map((date) => new Date(date).getTime())
                : row.default && new Date(row.default).getTime()
              : row.default
            : row.checked,
      });
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];

    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];
      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }

    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <Modal
      opened={visible}
      onClose={handleClose}
      centered
      closeOnEscape={fields.options?.allowCancel !== false}
      closeOnClickOutside={false}
      size="sm"
      title={<div className={classes.title}>{fields.heading}</div>}
      withCloseButton={false}
      overlayOpacity={0.5} // Slightly increased for better focus
      overlayBlur={12} // Enhanced blur for modern feel
      transition="fade"
      exitTransitionDuration={200}
      classNames={{ modal: classes.modal }}
    >
      <form onSubmit={onSubmit}>
        <Stack className={classes.contentStack}>
          <Stack className={classes.formContainer}>
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <InputField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {(row.type === 'date' || row.type === 'date-range') && (
                    <DateField control={form.control} row={row} index={index} />
                  )}
                  {row.type === 'textarea' && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Stack>

          <Group position="right" spacing={12} className={classes.buttonGroup}>
            <Button
              variant="default"
              onClick={() => handleClose()}
              className={`${classes.button} ${classes.cancelButton}`}
              disabled={fields.options?.allowCancel === false}
            >
              {locale.ui.cancel}
            </Button>
            <Button
              type="submit"
              className={`${classes.button} ${classes.confirmButton}`}
            >
              {locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default InputDialog;
