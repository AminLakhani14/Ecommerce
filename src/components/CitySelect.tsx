import { useId, useState } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import styles from '../pages/styles/Commerce.module.css';
interface Props { options:string[]; value:string; onChange:(value:string)=>void; disabled?:boolean; loading?:boolean; placeholder?:string }
export default function CitySelect({options,value,onChange,disabled,loading,placeholder='Search for your city'}:Props) {
  const id=useId();
  const [query,setQuery]=useState(value);
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(-1);
  const matching=options.filter(option=>option.toLowerCase().includes(query.toLowerCase()));
  const shown=matching.slice(0,50);
  const choose=(city:string)=>{setQuery(city);onChange(city);setOpen(false);setActive(-1);};
  return <div className={styles.cityCombobox}>
    <div className={styles.cityInput}><FiSearch aria-hidden='true' /><input id='shipping-city' role='combobox' aria-label='City' aria-autocomplete='list' aria-expanded={open} aria-controls={id} aria-activedescendant={open&&active>=0?`${id}-${active}`:undefined}
      autoComplete='off' required disabled={disabled} placeholder={loading?'Loading cities...':placeholder} value={query}
      onFocus={()=>setOpen(true)} onBlur={()=>{setOpen(false);setQuery(value);}}
      onChange={event=>{setQuery(event.target.value);onChange('');setOpen(true);setActive(-1);}}
      onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setOpen(true);setActive(index=>Math.min(index+1,shown.length-1));}else if(event.key==='ArrowUp'){event.preventDefault();setActive(index=>Math.max(0,index-1));}else if(event.key==='Enter'&&open){event.preventDefault();if(shown[active>=0?active:0])choose(shown[active>=0?active:0]);}else if(event.key==='Escape')setOpen(false);}} /><FiChevronDown aria-hidden='true' /></div>
    {open&&!disabled&&<div className={styles.cityOptions}><ul id={id} role='listbox' aria-label='Cities'>{shown.map((city,index)=><li key={city} id={`${id}-${index}`} role='option' aria-selected={city===value} className={active===index?styles.activeOption:''} onMouseDown={event=>event.preventDefault()} onClick={()=>choose(city)}>{city}</li>)}</ul>{!shown.length?<p>No matching cities. You can enter yours manually below.</p>:matching.length>50?<p>Keep typing to narrow down the results.</p>:null}</div>}
  </div>;
}
