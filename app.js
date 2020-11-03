const express = require('express');
const app = express();
require('dotenv').config();

let AWS = require('aws-sdk');

app.get('/', (req, res) => {

    console.log("Message = " + req.query.message);
    console.log("Number = " + req.query.number);
    console.log("Subject = " + req.query.subject);
    console.log("Sender= " + req.query.sender)

    let params = {
        Message: req.query.message,
        PhoneNumber: '+' + req.query.number,
        // country code + number. EX: +886 (Taiwan) + 0912-345-678
        // Will be 886912345678

        MessageAttributes: {
            //Ref for MessageAttributes: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html#sms_publish_sdk
            'AWS.SNS.SMS.SenderID': {

                'DataType': 'String',
                'StringValue': req.query.sender
                // 'StringValue' is the name of sender appears in the message.It must be 1-11 alpha-numeric characters
            }
        }
        // Resolution for error:
        // "The senderID provided  is not valid, it must be 1-11 alpha-numeric characters"
        // https://stackoverflow.com/questions/44769824/senderid-issues-sending-sms-on-amazon-sns-official-php-sdk
    };

    var publishTextPromise = new AWS.SNS({
        apiVersion: '2010-03-31',
        // region: 'us-west-2' // region can be set in .env
    }).publish(params).promise();

    //
    publishTextPromise
        .then(
            // Send response for successful result
            function (data) {
                res.end(JSON.stringify({
                    "Status": "SNS successfully sent",
                    MessageID: data.MessageId
                }));
            }
        )
        .catch(
            // Send response for failed result
            function (err) {
                console.log('\n Error while send SNS: \n', err)
                res.end(JSON.stringify({
                    "Status": "Failed to send SNS",
                    Error: err
                }));
            }
        );
});

app.listen(3000, () => console.log('SMS Service Listening on PORT 3000'))