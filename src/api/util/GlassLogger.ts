// GlassLogger.ts
import dayjs from 'dayjs';

type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface GlassLoggerOptions {
  appName?: string;
  getTime?: () => string;
}

export class GlassLogger {
  private appName: string;
  private getTime: () => string;

  constructor({ appName = 'GlassAPI', getTime = () => dayjs().format('HH:mm:ss+SSS') }: GlassLoggerOptions = {}) {
    this.appName = appName;
    this.getTime = getTime;
  }

  private baseStyle = 'font-weight: bold; border-radius: 4px; padding: 0 8px; font-size: 12px';

  private levelIcons: Record<LogLevel, string> = {
    log: '📘',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
  };

  private tagStyles: Record<LogLevel, string> = {
    log: `background: #D6EAFF; color: #003F66; ${this.baseStyle}`,
    info: `background: #94CCFF; color: #1A237E; ${this.baseStyle}`,
    warn: `background: #FFF9B0; color: #8A6D00; ${this.baseStyle}`,
    error: `background: #FF5555; color: #FFFFFF; ${this.baseStyle}`,
  };

  private appStyle = `background: linear-gradient(to right, #6A11CB, #2575FC); color: #FFFFFF; ${this.baseStyle}`;
  private timeStyle = `background: linear-gradient(to right, #43E97B, #38F9D7); color: #003F3F; ${this.baseStyle}`;

  private logStyled(level: LogLevel, content: any) {
    const levelStyle = this.tagStyles[level];
    const icon = this.levelIcons[level];

    const label = `%c✦ ${this.appName} ✦%c %c${this.getTime()}%c %c${icon} ${level.toUpperCase()}%c ${content}`;
    const consoleMethod = console[level] || console.log;

    consoleMethod.call(console, label, this.appStyle, '', this.timeStyle, '', levelStyle, '');
  }

  log(content: any) {
    this.logStyled('log', content);
  }

  info(content: any) {
    this.logStyled('info', content);
  }

  warn(content: any) {
    this.logStyled('warn', content);
  }

  error(content: any) {
    this.logStyled('error', content);
  }
}
