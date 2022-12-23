import { Reporter } from '@playwright/test/reporter';
import SlackNotify from 'slack-notify';
const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const slack = SlackNotify(MY_SLACK_WEBHOOK_URL);
const report_link = `http://localhost:9323/`

class MyReporter implements Reporter {
  successTests: number = 0
  failedTests = 0
  timedOut = 0
  totalTests;
  failedMessage: string[]

  onBegin(config, suite) {
    this.failedMessage = []
    this.totalTests = suite.allTests().length
  }

  onTestBegin(test) {
  }

  onTestEnd(test, result) {
    console.log(`Finished test ${test.title}: ${result.status}`);
    if (result.status == 'passed') {
      this.successTests++
    } else if (result.status == 'timedOut') {
      this.timedOut++
      console.log(`${test.title} is failing`)
      this.failedMessage.push(test.title)
    } else {
      this.failedTests++
      this.failedMessage.push(test.title)
    }
  }

  async onEnd(result) {
    await sendMessage(this.successTests, this.failedTests, this.timedOut, this.totalTests, this.failedMessage)
  }
}

async function sendMessage(success, failed, timedout, total, failedMessage) {
  const runTime = (new Date()).toLocaleString('lt-LT', { timeZone: 'Europe/Vilnius' }).slice(0, 19).replace(/-/g, "/").replace("T", " ");
  let time = `Tests completed at: ${runTime}\n`;
  let message = '';
  if (success == total) {
    message += `:100: All ${total} tests passed`
  } else if (failed == total || timedout == total) {
    message = "<!channel> All tests are failing!"
  }
  else if (timedout > 0) {
    let failedList = await failedPrettyfier(failedMessage)
    message += `Some tests failing :skull_and_crossbones:\n ${success} :white_check_mark:\n ${total - success} :x: \n Failing tests: \n ${failedList} \n Hey, <@U03MUJA2CHK>, have a look!`
  } else {
    let failedList = await failedPrettyfier(failedMessage)
    message += `Some tests failing :skull_and_crossbones:\n ${success} :white_check_mark:\n ${total - success} :x: \n Failing tests: \n ${failedList} \n Hey, <@U03MUJA2CHK>, have a look!`
  }

  await slack.send({
    text: time,
    fields: {
      'Results': message,
      'Report': `<${report_link}|:bar_chart:>`
    }
  });
}

async function failedPrettyfier(failedMessage) {
  let uniqueArray = failedMessage.filter(function(item, pos) {
    return failedMessage.indexOf(item) == pos;
  })
  let message = ''
  uniqueArray.forEach(function(element) {
    message += `${element} \n`
  });
  return message
}

export default MyReporter;
