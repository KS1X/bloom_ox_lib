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
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: theme.radius.lg,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    border: `1px solid ${theme.colors.dark[4]}`,
  },
  button: {
    textTransform: 'uppercase',
    fontWeight: 500,
    height: 36,
    letterSpacing: 0.5,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    color: theme.white,
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
      overlayOpacity={0.5}
      overlayBlur={8}
      transition="fade"
      exitTransitionDuration={150}
      classNames={{ modal: classes.modal }}
    >
      <form onSubmit={onSubmit}>
        <Stack>
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

          <Group position="right" spacing={10}>
            <Button
              variant="default"
              onClick={() => handleClose()}
              className={classes.button}
              disabled={fields.options?.allowCancel === false}
            >
              {locale.ui.cancel}
            </Button>
            <Button
              variant="filled"
              color={theme.primaryColor}
              type="submit"
              className={classes.button}
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