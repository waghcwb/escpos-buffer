import { Profile } from '../../src/profile';
import { Capability } from '../../src/capabilities';
import { Style, Align, Cut, Drawer } from '../../src';

class MockProfile extends Profile {
  get setAlignment() {
    return null;
  }
  set setAlignment(_: number) {}
  feed: (lines: number) => Promise<void> = jest.fn();
  cutter: (mode: Cut) => Promise<void> = jest.fn();
  buzzer: () => Promise<void> = jest.fn();
  drawer: (
    number: Drawer,
    on_time: number,
    off_time: number,
  ) => Promise<void> = jest.fn();
  qrcode: (data: string, size: number) => Promise<void> = jest.fn();
  setMode: (mode: number, enable: boolean) => Promise<void> = jest.fn();
  setStyle: (style: Style, enable: boolean) => Promise<void> = jest.fn();
  setStyles: (styles: number, enable: boolean) => Promise<void> = jest.fn();
  setCharSize: (charSize: {
    width: number;
    height: number;
  }) => Promise<void> = jest.fn();
}
const capability: Capability = {
  columns: 42,
  profile: 'epson',
  model: 'A123',
  brand: 'Custom',
  codepage: 'utf8',
  codepages: [
    {
      code: 'utf8',
      command: '',
    },
  ],
  fonts: [
    {
      name: 'Font A',
      columns: 42,
    },
  ],
};

describe('Profile', () => {
  afterEach(() => jest.resetAllMocks());
  describe('withStyle', () => {
    it('should apply font size and then unapply it after calling the callback', () => {
      const profile = new MockProfile(capability);
      const styleConf = {
        width: 4,
        height: 8,
      };
      const cb = jest.fn();

      profile.withStyle(styleConf, cb);

      expect(profile.setCharSize).toHaveBeenCalledWith({ ...styleConf });
      expect(cb).toHaveBeenCalledTimes(1);
      expect(profile.setCharSize).toHaveBeenCalledWith({ width: 1, height: 1 });
    });

    it('should apply style and then unapply it after calling the callback', () => {
      const profile = new MockProfile(capability);
      const styleConf = {
        bold: true,
        italic: true,
        underline: true,
      };
      const cb = jest.fn();

      profile.withStyle(styleConf, cb);

      const expectedStyles = Style.Bold | Style.Italic | Style.Underline;

      expect(profile.setStyles).toHaveBeenCalledWith(expectedStyles, true);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(profile.setStyles).toHaveBeenCalledWith(expectedStyles, false);
    });

    it('should apply alignment and then unapply it after calling the callback', () => {
      const profile = new MockProfile(capability);
      const alignmentSetter = jest.spyOn(profile, 'alignment', 'set');
      const align = Align.Center;
      const styleConf = {
        align,
      };
      const cb = jest.fn();

      profile.withStyle(styleConf, cb);

      expect(alignmentSetter).toHaveBeenCalledWith(align);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(alignmentSetter).toHaveBeenCalledWith(Align.Left);
    });
  });
});
