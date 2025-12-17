
import Select from 'react-select';
import { ChevronDown } from 'lucide-react';

// RadixのTrigger風に寄せたスタイル
const radixLikeStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 36,
    borderRadius: 6,
    borderColor: state.isFocused ? 'var(--ring, #000000ff)' : 'var(--input, #000000ff)',
    boxShadow: state.isFocused ? '0 0 0 1px var(--ring, #000000ff)' : 'none',
    '&:hover': { borderColor: 'var(--ring, #000000ff)' },
  }),
  valueContainer: (base: any) => ({ ...base, 
    padding: '0 8px',

  }),
  placeholder: (base: any) => ({ ...base, color: 'var(--muted-foreground, #9ca3af)' }),
  dropdownIndicator: (base: any) => ({ ...base, paddingRight: 8 }),
  menu: (base: any) => ({
    ...base,
    width: 'max-content',
    minWidth: '100%', // コントロール幅未満にはしない
  }),
  menuList: (base: any) => ({
    ...base,
    width: 'max-content',
  }),
  option: (base: any) => ({
    ...base,
    whiteSpace: 'nowrap', // 内容計測のために折り返さない（必要に応じて外してOK）
  }),
};

type Option = { value: string; label: string };

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = '選択してください…',
}: {
  options: Option[];
  value?: Option | null;
  onChange?: (opt: Option | null) => void;
  placeholder?: string;
}) {
  return (
    <Select
      instanceId="search-select"
      options={options}
      value={value ?? null}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable
      styles={radixLikeStyles}
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: (props) => (
          <div {...props.innerProps} className="pr-2">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        ),
      }}
      aria-label="検索付き選択"
    />
  );
}
