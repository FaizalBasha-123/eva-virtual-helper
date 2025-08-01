
import SharedLocationInput from '@/components/shared/LocationInput';

interface LocationInputProps {
  onClick: () => void;
  className?: string;
}

const LocationInput = (props: LocationInputProps) => {
  return <SharedLocationInput {...props} />;
};

export default LocationInput;
