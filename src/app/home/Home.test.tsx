import { LocaleContext } from 'context/locale/localeContext/LocaleContext';
import { render, act } from 'tests';

import { Home } from './Home';

describe('Home', () => {
  test('renders heading', () => {
    const { getByText } = render(<Home />);
    const element = getByText(/Home/);
    expect(element).toBeInTheDocument();
  });

  test('changes locale when "here" button is clicked', () => {
    const { getByText } = render(
      <LocaleContext.Consumer>
        {(value) => (
          <>
            <span>LOCALE: {value?.locale}</span>
            <Home />
          </>
        )}
      </LocaleContext.Consumer>,
    );

    const initialText = getByText(/LOCALE/).textContent as string;

    act(() => getByText(/here/).click());

    expect(getByText(/LOCALE/)).not.toHaveTextContent(initialText);

    act(() => getByText(/here/).click());

    expect(getByText(/LOCALE/)).toHaveTextContent(initialText);
  });
});
