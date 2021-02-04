/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2021 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import * as util from "util";

import { OutputFormatter } from "../Formatter/OutputFormatter";
import { OutputInterface } from "../Output/OutputInterface";
import { ChoiceQuestion } from "../Question/ChoiceQuestion";
import { ConfirmationQuestion } from "../Question/ConfirmationQuestion";
import { Question } from "../Question/Question";
import { QuestionHelper } from "./QuestionHelper";

export class StyleQuestionHelper extends QuestionHelper {

    protected writePrompt<Type>(question: Question<Type>, output: OutputInterface) {
        let text = OutputFormatter.escapeTrailingBackslash(question.getMessage());
        const defaultValue = question.getDefault();

        if (null === defaultValue) {
            text = util.format(" <info>%s</info>", text);
        } else if (question instanceof ConfirmationQuestion) {
            text = util.format(" <info>%s (yes/no)</info> [<comment>%s</comment>]", text, defaultValue ? "yes" : "no");
        } else if (question instanceof ChoiceQuestion && question.isMultiselect()) {
            const choices = (question).getChoices();
            const defaultChoices = ((defaultValue ?? "") + "").split(",").map((item) => {
                return choices.get(item.trim());
            });

            text = util.format(" <info>%s</info> [<comment>%s</comment>]:", text, OutputFormatter.escapeBackslashes(defaultChoices.join(", ")));
        } else if (question instanceof ChoiceQuestion) {
            const choices = (question).getChoices();
            const defaultValueString = (defaultValue ?? "") + "";
            const defaultChoice = choices.get(defaultValueString);

            text = util.format(" <info>%s</info> [<comment>%s</comment>]:", text, OutputFormatter.escapeBackslashes(defaultChoice ?? defaultValueString));
        } else {
            text = util.format(" <info>%s</info> [<comment>%s</comment>]:", text, OutputFormatter.escapeBackslashes((defaultValue ?? "") + ""));
        }

        output.writeln(text);

        if (question instanceof ChoiceQuestion) {
            output.writeln(this.formatChoiceQuestionChoices(question, "comment"));
            output.writeln("");
        }
    }

    protected getPrompt<Type>(question: Question<Type>): string {
        if (question instanceof ChoiceQuestion) {
            return question.getPrompt() + " ";
        }

        return " > ";
    }

}
